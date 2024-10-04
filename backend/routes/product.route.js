import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductById,
  getProductsByCategory,
  getRecommendedProducts,
  toggleFeaturedProduct,
  updateProduct,
} from "../controllers/product.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/recommendations", getRecommendedProducts);

router.get("/featured", getFeaturedProducts);
router.get("/:id", getProductById);

router.get("/category/:category", getProductsByCategory);
router.post(
  "/",
  protectRoute,
  adminRoute,
  upload.array("images"),
  createProduct
);
router.put(
  "/:id",
  protectRoute,
  adminRoute,
  upload.array("images"),
  updateProduct
);
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

export default router;
