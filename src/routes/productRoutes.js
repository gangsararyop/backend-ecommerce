const express = require("express");
const { uploader } = require("../helpers");
const router = express.Router();
const { productControllers } = require("./../controllers");
const {
  categories,
  sizes,
  addProduct,
  getProduct,
  deleteProducts,
  editProducts,
} = productControllers;

const uploadFile = uploader("/products", "PROD").fields([
  { name: "image", maxCount: 3 },
]);

router.get("/categories", categories);
router.get("/sizes", sizes);
router.post("/add", uploadFile, addProduct);
router.get("/get", getProduct);
router.delete("/:productsId", deleteProducts);
router.put("/:productsId", uploadFile, editProducts);

module.exports = router;
