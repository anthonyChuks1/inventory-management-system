const express = require("express");
const router = express.Router();
const routerController = require("../controllers/routerController");

router.get("/", routerController.index);

router.get("/men", routerController.category("Men"));
router.get("/women", routerController.category("Women"));
router.get("/kids", routerController.category("Kids"));

router.get("/products", routerController.listProducts);
router.get("/products/:id", routerController.productDetail);

router.get("/about", routerController.about);
router.get("/contact", routerController.contact);

module.exports = router;
