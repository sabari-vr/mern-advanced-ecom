import mongoose from "mongoose";
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        size: String,
        color: String,
        quantity: Number,
        price: Number,
      },
    ],
    orderDate: {
      type: Date,
      default: Date.now,
    },
    address: {
      type: Object,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: [
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
        "refunded",
      ],
      default: "processing",
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model("Order", orderSchema);
