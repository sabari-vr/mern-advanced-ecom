import express from "express";
import { protectRoute } from "../middleware/auth.js";
import {
  createReview,
  getOrderByIdForReview,
  getReviewByProductId,
} from "../controllers/review.controller.js";

const router = express.Router();

router.get("/get-order/:id", protectRoute, getOrderByIdForReview);
router.get("/:productId", protectRoute, getReviewByProductId);
router.post("/", protectRoute, createReview);

export default router;
