import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import { connectDB } from "./config/connectDB.js";
import job from "./cron.js";
import swaggerSetup from "./swagger.js";

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import categoriesRoutes from "./routes/category.route.js";
import paymentRoutes from "./routes/payment.route.js";
import orderRoutes from "./routes/order.route.js";
import userRoutes from "./routes/user.route.js";
import analticsRoutes from "./routes/analtics.route.js";
import reviewRoutes from "./routes/review.route.js";

dotenv.config();
job.start();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// const corsOptions = {
//   origin: "http://yourfrontenddomain.com",
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

app.use(cors({ origin: "*", credentials: true }));

app.use(express.json({ limit: "15mb" }));
swaggerSetup(app);

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/user", userRoutes);
app.use("/api/analtics", analticsRoutes);
app.use("/api/review", reviewRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port: ", PORT);
});
