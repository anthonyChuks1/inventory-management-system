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

function disconnectDB() {
  mongoose.connection.close(() => {
    console.log("Disconnected from MongoDB");
  });
}

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  unitPrice: { type: mongoose.Schema.Types.Decimal128, required: true },
  image: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  quantity: { type: Number, required: true },
  supplier: { type: String, required: true },
});

const productVariantSchema = new mongoose.Schema({
  SKU: { type: String, required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  variantName: { type: String, required: true },
  variantValue: { type: String, required: true },
  additionalPrice: { type: Number, default: 0 },
  color: { type: String },
  size: { type: String },
});
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

const Product = mongoose.model("Product", productSchema);
const ProductVariant = mongoose.model("ProductVariant", productVariantSchema);
const Category = mongoose.model("Category", categorySchema);

module.exports = { Product, Category, ProductVariant, connectDB, disconnectDB };
