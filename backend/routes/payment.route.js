import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { orderAPI, veifyOrder } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/order", protectRoute, orderAPI);
router.post("/verify", protectRoute, veifyOrder);

export default router;
