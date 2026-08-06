const fs = require("fs");
const path = require("path");
const { Product, Category, ProductVariant } = require("../models/schema");

// GET / - Home page
exports.index = (req, res) => {
  res.render("index");
};

// GET /products - List all products (Example implementation)
exports.listProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.render("products", { products });
  } catch (err) {
    res.status(500).send("Error retrieving products");
  }
};

exports.men = async (req, res) => {
  try {
    const menProducts = await Product.find({ category: "men" });
    res.render("men", { products: menProducts });
  } catch (err) {
    res.status(500).send("Error retrieving men's products");    
  }
}

exports.women = async (req, res) => {
  try {
    const menProducts = await Product.find({ category: "men" });
    res.render("men", { products: menProducts });
  } catch (err) {
    res.status(500).send("Error retrieving men's products");    
  }
}

exports.kids = async (req, res) => {
  try {
    const menProducts = await Product.find({ category: "men" });
    res.render("men", { products: menProducts });
  } catch (err) {
    res.status(500).send("Error retrieving men's products");    
  }
}

exports.about = async (req, res) => {
  try {
    const menProducts = await Product.find({ category: "men" });
    res.render("men", { products: menProducts });
  } catch (err) {
    res.status(500).send("Error retrieving men's products");    
  }
}

exports.about = async (req, res) => {
  try {
    const menProducts = await Product.find({ category: "men" });
    res.render("men", { products: menProducts });
  } catch (err) {
    res.status(500).send("Error retrieving men's products");    
  }
}