import mongoose from "mongoose";

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    batchId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    images: {
      type: Array,
      required: [true, "Image is required"],
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: Number,
      enum: [0, 1, 2], // 0 = male, 1 = female, 2 = gender neutral
      default: 0,
    },
    for: {
      type: Number,
      enum: [0, 1, 2], // 0 = adult, 1 = kids, 2 = all
      default: 0,
    },
    size: {
      6: { type: Number, min: 0 },
      7: { type: Number, min: 0 },
      8: { type: Number, min: 0 },
      9: { type: Number, min: 0 },
      10: { type: Number, min: 0 },
      11: { type: Number, min: 0 },
      12: { type: Number, min: 0 },
      30: { type: Number, min: 0 },
      32: { type: Number, min: 0 },
      34: { type: Number, min: 0 },
      36: { type: Number, min: 0 },
      38: { type: Number, min: 0 },
      40: { type: Number, min: 0 },
      42: { type: Number, min: 0 },
      44: { type: Number, min: 0 },
      46: { type: Number, min: 0 },
      48: { type: Number, min: 0 },
      50: { type: Number, min: 0 },
      XS: { type: Number, min: 0 },
      S: { type: Number, min: 0 },
      M: { type: Number, min: 0 },
      L: { type: Number, min: 0 },
      XL: { type: Number, min: 0 },
      XXL: { type: Number, min: 0 },
      XXXL: { type: Number, min: 0 },
      XXXXL: { type: Number, min: 0 },
      FREE: { type: Number, min: 0 },
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
