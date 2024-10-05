import { Order } from "../models/order.modal.js";
import { Payment } from "../models/payment.modal.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import {
  sendOrderCancelEmail,
  sendOrderStatusChangeEmail,
} from "../email/emails.js";

function capitalizeFirstLetter(string) {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const getAllOrders = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  try {
    const skip = (page - 1) * limit;
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "userId",
        select: "email name ",
        model: User,
      })
      .populate({
        path: "items.productId",
        select: "name price",
        model: Product,
      })
      .populate({
        path: "paymentId",
        select: "razorpay_order_id razorpay_payment_id date",
        model: Payment,
      });

    const totalOrders = await Order.countDocuments({});
    const totalPages = Math.ceil(totalOrders / limit);

    res.json({
      orders,
      pagination: {
        totalOrders,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving orders",
    });
  }
};

export const getMyOrders = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  try {
    const skip = (page - 1) * limit;
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments({ userId: req.user.id });
    const totalPages = Math.ceil(totalOrders / limit);

    res.json({
      orders,
      pagination: {
        totalOrders,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving orders",
    });
  }
};

export const cancelOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.orderStatus === "cancelled") {
      return res.status(400).json({ message: "Order is already cancelled" });
    }

    order.orderStatus = "cancelled";
    await order.save();

    const user = await User.findById(req.user.id);
    await sendOrderCancelEmail(user.email);

    return res
      .status(200)
      .json({ message: "Order cancelled successfully", order });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const validStatuses = [
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "returned",
      "refunded",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status provided" }); // Handle invalid status
    }

    order.orderStatus = status;
    await order.save();

    const user = await User.findById(req.user.id);
    await sendOrderStatusChangeEmail(user.email, capitalizeFirstLetter(status));

    return res
      .status(200)
      .json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
