import crypto from "crypto";
import mongoose from "mongoose";
import Razorpay from "razorpay";
import { Payment } from "../models/payment.modal.js";
import { Order } from "../models/order.modal.js";
import { User } from "../models/user.model.js";
import { sendOrderSuccessEmail } from "../email/emails.js";
import { Product } from "../models/product.model.js";

const razorpayInstance = new Razorpay({
  key_id: process.env.key_id,
  key_secret: process.env.key_secret,
});

export const orderAPI = async (req, res) => {
  const { amount, itemsInCart } = req.body;

  try {
    for (const item of itemsInCart) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.name}` });
      }
      if (!product.size.hasOwnProperty(item.size)) {
        return res.status(400).json({
          message: `Invalid size ${item.size} for product ${item.name}`,
        });
      }
      if (product.size[item.size] < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for product ${item.name} in size ${item.size}`,
          availableStock: product.size[item.size],
          requestedQuantity: item.quantity,
        });
      }
    }

    const options = {
      amount: Number(amount * 100),
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.error("Razorpay order creation error:", error);
        return res.status(500).json({ message: "Failed to create order" });
      }
      res.status(200).json({ data: order });
    });
  } catch (error) {
    console.error("Error in orderAPI:", error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

export const veifyOrder = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    itemsInCart,
    deliveryAddress,
    clearCart,
  } = req.body;

  try {
    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.key_secret)
      .update(sign.toString())
      .digest("hex");

    const isAuthentic = expectedSign === razorpay_signature;

    if (isAuthentic) {
      const payment = new Payment({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      const savedPayment = await payment.save();

      const order = new Order({
        paymentId: savedPayment._id,
        userId: req.user.id,
        items: itemsInCart.map((item) => ({
          productId: item.productId,
          name: item.name,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: item.price,
        })),
        address: deliveryAddress,
      });

      await order.save();

      const session = await mongoose.startSession();
      try {
        await session.withTransaction(async () => {
          for (const item of itemsInCart) {
            const product = await Product.findById(item.productId).session(
              session
            );
            if (!product) {
              throw new Error(`Product not found: ${item.productId}`);
            }
            if (
              !product.size.hasOwnProperty(item.size) ||
              product.size[item.size] < item.quantity
            ) {
              throw new Error(
                `Insufficient quantity for product ${item.name} in size ${item.size}`
              );
            }
            product.size[item.size] -= item.quantity;
            await product.save();
          }

          if (clearCart) {
            await User.findByIdAndUpdate(req.user.id, {
              $set: { cartItems: [] },
            }).session(session);
          }
        });
      } catch (transactionError) {
        throw transactionError;
      } finally {
        await session.endSession();
      }

      await sendOrderSuccessEmail(req.user.email);

      res.status(201).json({
        message: "Order placed Successfully",
        orderId: razorpay_order_id,
      });
    } else {
      console.log("Invalid signature");
      res.status(400).json({ message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Error in verifyOrder:", error);
    res.status(500).json({
      message: "Internal Server Error!",
      error: error.message,
      stack: error.stack,
    });
  }
};
