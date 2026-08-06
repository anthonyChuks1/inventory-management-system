const express = require("express");
const router = express.Router();
const routerController = require("../controllers/routerController");

router.get("/", routerController.index);
// router.get("/men", routerController.listProducts);
// router.get("/women", routerController.listProducts);
// router.get("/kids", routerController.listProducts);
// router.get("/about", routerController.index);
// router.get("/contact", routerController.index);
// router.get("/products", routerController.listProducts);


module.exports = router;