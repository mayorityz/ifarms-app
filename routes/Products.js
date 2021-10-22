const express = require("express");

const Router = express.Router();

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

const productsController = require("../controllers/Products");

Router.get("/allproducts", productsController.allProducts);
Router.get("/fetchproducts/:userid", productsController.myProducts);
Router.post("/fetchproducts", productsController.myProducts);
Router.post(
  "/newproduct",
  upload.array("file", 8),
  productsController.newProducts
);
Router.get("/productdetails/:id", productsController.productDetails);
Router.post("/products/deleteitem", productsController.deleteProduct);
Router.post("/products/checkout", productsController.checkout);
Router.get("/products/verifypayment", productsController.verify);
Router.post("/products/edit", productsController.update);
module.exports = Router;
