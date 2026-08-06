const { Product, Category, ProductVariant } = require("../models/schema");

// ---------- helpers ----------

// Sum variant quantities for a set of products in one query instead of N+1.
async function attachStock(products) {
  const ids = products.map((p) => p._id);
  const totals = await ProductVariant.aggregate([
    { $match: { product: { $in: ids } } },
    { $group: { _id: "$product", total: { $sum: "$quantity" } } },
  ]);
  const stockMap = new Map(totals.map((t) => [String(t._id), t.total]));
  return products.map((p) => ({
    ...p,
    totalStock: stockMap.get(String(p._id)) || 0,
    unitPrice: Number(p.unitPrice), // Decimal128 -> plain number for the view
  }));
}

// Maps a stock count to a badge label/class used by global.css (.badge.in/.low/.zero)
function stockBadge(total) {
  if (total <= 0) return { cls: "zero", label: "Out of stock" };
  if (total <= 5) return { cls: "low", label: "Low stock" };
  return { cls: "in", label: "In stock" };
}

// ---------- routes ----------

// GET / - Home page: a handful of featured products
exports.index = async (req, res) => {
  try {
    const rawProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .populate("category")
      .lean();
    const products = await attachStock(rawProducts);
    res.render("index", {
      title: "The Camel Road",
      products,
      stockBadge,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("index", {
      title: "The Camel Road",
      products: [],
      stockBadge,
      error: "Could not load featured products.",
    });
  }
};

// GET /products - full catalog
exports.listProducts = async (req, res) => {
  try {
    const rawProducts = await Product.find().populate("category").lean();
    const products = await attachStock(rawProducts);
    res.render("category", {
      title: "All Products",
      heading: "All Products",
      products,
      stockBadge,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("category", {
      title: "All Products",
      heading: "All Products",
      products: [],
      stockBadge,
      error: "Error retrieving products.",
    });
  }
};

// GET /men, /women, /kids - category pages
// Returns a route handler bound to a category name so one function covers all three.
exports.category = (categoryName) => async (req, res) => {
  try {
    const category = await Category.findOne({
      name: new RegExp(`^${categoryName}$`, "i"),
    }).lean();

    if (!category) {
      const products = [];
      return res.render("category", {
        title: categoryName,
        heading: categoryName,
        products,
        stockBadge,
        error: `No "${categoryName}" category has been set up yet.`,
      });
    }

    const rawProducts = await Product.find({ category: category._id })
      .populate("category")
      .lean();
    const products = await attachStock(rawProducts);

    res.render("category", {
      title: categoryName,
      heading: categoryName,
      products,
      stockBadge,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("category", {
      title: categoryName,
      heading: categoryName,
      products: [],
      stockBadge,
      error: `Error retrieving ${categoryName} products.`,
    });
  }
};

// GET /products/:id - single product detail with its variants
exports.productDetail = async (req, res) => {
  try {
    const rawProduct = await Product.findById(req.params.id)
      .populate("category")
      .lean();

    if (!rawProduct) {
      return res.status(404).render("404", { title: "Not found" });
    }

    const variants = await ProductVariant.find({
      product: rawProduct._id,
    }).lean();
    const totalStock = variants.reduce((sum, v) => sum + v.quantity, 0);

    const product = {
      ...rawProduct,
      unitPrice: Number(rawProduct.unitPrice),
    };
    const normalizedVariants = variants.map((v) => ({
      ...v,
      additionalPrice: Number(v.additionalPrice),
    }));

    res.render("detail", {
      title: product.name,
      product,
      variants: normalizedVariants,
      badge: stockBadge(totalStock),
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("404", { title: "Not found" });
  }
};

// GET /about
exports.about = (req, res) => {
  res.render("about", { title: "About" });
};

// GET /contact
exports.contact = (req, res) => {
  res.render("contact", { title: "Contact" });
};
