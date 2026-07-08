const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/", protect, adminOnly, upload.array("images", 5), createProduct);

router.put("/:id", protect, adminOnly, upload.array("images", 5), updateProduct);

router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;