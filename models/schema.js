const mongoose = require("mongoose");

async function connectDB(url) {
  try {
    await mongoose.connect(url);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit the process with failure
  }
}

async function disconnectDB() {
  await mongoose.connection.close();
  console.log("Disconnected from MongoDB");
}

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    unitPrice: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      min: 0,
    },
    images: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "At least one image is required",
      },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    supplier: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const productVariantSchema = new mongoose.Schema(
  {
    SKU: { type: String, required: true, unique: true, trim: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    color: { type: String, trim: true },
    size: { type: String, trim: true },
    additionalPrice: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0,
      min: 0,
    },
    quantity: { type: Number, required: true, min: 0, default: 0 },
  },
  { timestamps: true }
);

// A given product shouldn't have two variants with the same color/size combo
productVariantSchema.index({ product: 1, color: 1, size: 1 }, { unique: true });

const Product = mongoose.model("Product", productSchema);
const ProductVariant = mongoose.model("ProductVariant", productVariantSchema);
const Category = mongoose.model("Category", categorySchema);

module.exports = { Product, Category, ProductVariant, connectDB, disconnectDB };
