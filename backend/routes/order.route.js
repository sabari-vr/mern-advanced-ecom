import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.js";
import {
  cancelOrder,
  getAllOrders,
  getMyOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";

const router = express.Router();

router.get("/getAllOrders", protectRoute, adminRoute, getAllOrders);
router.get("/", protectRoute, getMyOrders);
router.patch("/cancel/:id", protectRoute, cancelOrder);
router.patch("/update-status/:id", protectRoute, adminRoute, updateOrderStatus);

export default router;
