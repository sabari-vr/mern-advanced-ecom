import express from "express";
import { protectRoute } from "../middleware/auth.js";
import {
  createAddress,
  deleteAddress,
  getAddress,
  getMyWishlist,
  toggleWishlist,
  updateAddress,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/address", protectRoute, getAddress);
router.post("/address", protectRoute, createAddress);
router.put("/address/:id", protectRoute, updateAddress);
router.delete("/address/:id", protectRoute, deleteAddress);

router.get("/wishlist", protectRoute, getMyWishlist);
router.post("/wishlist/toggle", protectRoute, toggleWishlist);

export default router;
