require("dotenv").config();
const mongoose = require("mongoose");
const {
  Product,
  Category,
  ProductVariant,
  connectDB,
  disconnectDB,
  decrementStock,
  deleteVariant,
  deleteVariants,
} = require("../models/schema");

const PLACEHOLDER_IMG = "https://placehold.co/600x750?text=Camel+Road";

async function seed() {
  await connectDB(process.env.MONGODB_URI);

  console.log("Clearing existing data...");
  await Promise.all([
    Product.deleteMany({}),
    Category.deleteMany({}),
    ProductVariant.deleteMany({}),
  ]);

  console.log("Creating categories...");
  const [men, women, kids] = await Category.create([
    { name: "Men", description: "Clothing for men" },
    { name: "Women", description: "Clothing for women" },
    { name: "Kids", description: "Clothing for kids" },
  ]);

  console.log("Creating products...");
  const products = await Product.create([
    {
      name: "Desert Trail Jacket",
      description: "A lightweight, weatherproof jacket built for long days outdoors.",
      unitPrice: 129.0,
      images: [PLACEHOLDER_IMG],
      category: men._id,
      supplier: "Atlas Outfitters",
    },
    {
      name: "Dune Runner Tee",
      description: "Breathable moisture-wicking t-shirt for warm-weather miles.",
      unitPrice: 28.0,
      images: [PLACEHOLDER_IMG],
      category: men._id,
      supplier: "Atlas Outfitters",
    },
    {
      name: "Oasis Wrap Dress",
      description: "Flowy, packable dress that transitions from trail to town.",
      unitPrice: 68.0,
      images: [PLACEHOLDER_IMG],
      category: women._id,
      supplier: "Caravan Textiles",
    },
    {
      name: "Sahara Windbreaker",
      description: "Packable windbreaker with a relaxed, everyday fit.",
      unitPrice: 84.0,
      images: [PLACEHOLDER_IMG],
      category: women._id,
      supplier: "Caravan Textiles",
    },
    {
      name: "Little Nomad Hoodie",
      description: "Soft, durable hoodie sized for kids on the move.",
      unitPrice: 38.0,
      images: [PLACEHOLDER_IMG],
      category: kids._id,
      supplier: "Camel Road Kids",
    },
  ]);

  console.log("Creating variants...");
  const sizes = ["S", "M", "L", "XL"];
  const colorsByProduct = {
    "Desert Trail Jacket": ["Sand", "Charcoal"],
    "Dune Runner Tee": ["Sand", "Ink", "Rust"],
    "Oasis Wrap Dress": ["Terracotta", "Olive"],
    "Sahara Windbreaker": ["Charcoal", "Sand"],
    "Little Nomad Hoodie": ["Sand", "Sky"],
  };

  const variantDocs = [];
  for (const product of products) {
    const colors = colorsByProduct[product.name] || ["Default"];
    let skuCounter = 1;
    for (const color of colors) {
      for (const size of sizes) {
        variantDocs.push({
          SKU: `${product.name.slice(0, 3).toUpperCase()}-${color
            .slice(0, 3)
            .toUpperCase()}-${size}-${skuCounter}`,
          product: product._id,
          color,
          size,
          additionalPrice: 0,
          quantity: Math.floor(Math.random() * 20), // 0-19, so some show low/out of stock
        });
        skuCounter++;
      }
    }
  }
  const savedVariants = await ProductVariant.create(variantDocs);

  console.log(
    `Seeded ${products.length} products, ${variantDocs.length} variants, 3 categories.`
  );

  //This specifically deletes the Sahara Windbreaker product and all its variants
  await deleteVariants(products[3]._id);

  //This specifically deletes the variant size medium from the Dune Runner Tee's sand colour.

  //Getting specificly Dune Runner.
  const duneRunner = products.find(p => p.name === "Dune Runner Tee");

  //Isolating the variant by the size.
  const mediumVariant = savedVariants.find(v => v.product.equals(duneRunner._id) && v.size == "M");

  //Deleting that size by the ID.
  await deleteVariant(mediumVariant._id);

  await disconnectDB();
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
