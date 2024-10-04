import { Order } from "../models/order.modal.js";
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.modal.js";

export const createReview = async (req, res) => {
  const { productId, rating, review } = req.body;
  const userId = req.user.id;

  if (!userId) {
    return res.status(401).json({ message: "User not found" });
  }

  if (!productId || !rating || !review) {
    return res
      .status(400)
      .json({ message: "Product ID, rating, and review are required." });
  }

  try {
    const newReview = new Review({
      productId,
      userId,
      rating,
      review,
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ message: "Error saving review", error });
  }
};

export const getReviewByProductId = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { batchId } = product;

    if (!batchId) {
      return res
        .status(400)
        .json({ message: "Batch ID not found for this product" });
    }

    const productsInBatch = await Product.find({ batchId });

    const productIdsInBatch = productsInBatch.map((p) => p._id);

    const reviews = await Review.find({
      productId: { $in: productIdsInBatch },
    });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error });
  }
};

export const getOrderByIdForReview = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({ _id: id, userId: req.user.id });

    res.json(order);
  } catch (error) {
    console.log("Error in getCartProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
