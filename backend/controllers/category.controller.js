import cloudinary from "../config/cloudinary.js";
import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";

export const createCategory = async (req, res) => {
  try {
    const data = JSON.parse(req.body.data);
    const images = JSON.parse(req.body.images);
    const { name } = data;

    const newCategory = new Category({ name });

    const file = images[0];

    const cloudinaryResponse = await cloudinary.uploader.upload(file.base64, {
      folder: "category",
    });

    newCategory.image = cloudinaryResponse.secure_url;
    await newCategory.save();
    res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    console.error("Error creating category:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error getting categories:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    console.error("Error getting category by ID:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;

  const data = JSON.parse(req?.body?.data);
  const images = req?.body?.images ? JSON.parse(req?.body?.images) : [];
  const { name } = data;

  try {
    let cloudinaryResponse;

    const file = images[0];
    if (file && file.base64) {
      cloudinaryResponse = await cloudinary.uploader.upload(file.base64, {
        folder: "category",
      });
    }

    const category = await Category.findByIdAndUpdate(
      id,
      {
        name,
        image: cloudinaryResponse?.secure_url || undefined,
      },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Error updating category:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const products = await Product.find({ categoryId: id });
    if (products.length > 0) {
      return res.status(400).json({
        message: "Cannot delete category because it contains products.",
      });
    }

    const imagePublicId = category.image.split("/").pop().split(".")[0];
    try {
      await cloudinary.uploader.destroy(`category/${imagePublicId}`);
      console.log(`Deleted image from Cloudinary`);
    } catch (error) {
      console.log(`Error deleting image from Cloudinary`, error);
    }
    await Category.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: "Category and image deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
