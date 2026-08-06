// Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const path = require("path");
const { connectDB } = require("./models/schema");

const app = express();
const port = process.env.PORT || 3000;
const dbUri = process.env.MONGODB_URI;

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

connectDB(dbUri);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Makes activePath & menu automatically available in every Pug template
app.use((req, res, next) => {
  res.locals.activePath = req.path;
  res.locals.menu = [
    { label: "Home", url: "/" },
    { label: "Men", url: "/men" },
    { label: "Women", url: "/women" },
    { label: "Kids", url: "/kids" },
    { label: "About", url: "/about" },
    { label: "Contact", url: "/contact" },
  ];
  next();
});

// Mount the routes at the root path
const camelRoadRoutes = require("./routes/camel-road");
app.use("/", camelRoadRoutes);

// Simple handler for the contact form so the page doesn't error on submit
app.post("/contact", (req, res) => {
  console.log("Contact form submission:", req.body);
  res.redirect("/contact");
});

// 404 - keep last
app.use((req, res) => {
  res.status(404).render("404", { title: "Not found" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
