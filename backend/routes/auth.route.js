import express from "express";
import {
  login,
  logout,
  signup,
  verifyEmail,
  forgotPassword,
  resetPassword,
  logoutAll,
  refreshToken,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.post("/logout", protectRoute, logout);
router.post("/logout-from-all-device", protectRoute, logoutAll);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.post("/refresh-token", refreshToken);

export default router;
