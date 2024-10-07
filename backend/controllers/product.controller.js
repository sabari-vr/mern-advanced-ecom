import cloudinary from "../config/cloudinary.js";
import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { redis } from "../config/redis.js";
import crypto from "crypto";

export const getAllProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const skip = (page - 1) * limit;

    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .populate({
        path: "categoryId",
        select: "name",
        model: Category,
      })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments({});
    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      products,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.log("Error in getAllProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const relatedProducts = await Product.find({
      batchId: product.batchId,
      _id: { $ne: id },
    }).select("color _id images");

    const related = relatedProducts.map((p) => ({
      color: p.color,
      id: p._id,
      image: p.images[0],
    }));

    res.json({ product, related });
  } catch (error) {
    console.log("Error in getProductById controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }

    // .lean() is gonna return a plain javascript object instead of a mongodb document
    // which is good for performance
    featuredProducts = await Product.find({ isFeatured: true }).lean();

    if (!featuredProducts) {
      return res.status(404).json({ message: "No featured products found" });
    }
    res.json(featuredProducts);
  } catch (error) {
    console.log("Error in getFeaturedProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const genarateSignedURl = (req, res) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = crypto
    .createHash("sha256")
    .update(`timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`)
    .digest("hex");

  const signedUrl = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/upload?api_key=${process.env.CLOUDINARY_API_KEY}&timestamp=${timestamp}&signature=${signature}`;

  res.status(200).json({ signedUrl });
};

export const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    const {
      name,
      description,
      price,
      categoryId,
      size,
      color,
      batchId,
      images,
      gender,
      for: audiance,
    } = productData;

    const product = await Product.create({
      name,
      description,
      price,
      categoryId,
      size,
      color,
      batchId,
      images,
      gender,
      for: audiance,
    });

    res.status(201).json(product);
  } catch (error) {
    console.log("Error in createProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productData = req.body;
    const {
      name,
      description,
      price,
      categoryId,
      size,
      color,
      batchId,
      images,
      gender,
      for: audiance,
    } = productData;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        images,
        categoryId,
        size,
        color,
        batchId,
        gender,
        for: audiance,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.log("Error in updateProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.images && product.images.length > 0) {
      const deletePromises = product.images.map(async (imageUrl) => {
        const publicId = imageUrl.split("/").pop().split(".")[0];
        try {
          await cloudinary.uploader.destroy(`products/${publicId}`);
          console.log(`Deleted image from Cloudinary: ${imageUrl}`);
        } catch (error) {
          console.log(
            `Error deleting image from Cloudinary: ${imageUrl}`,
            error
          );
        }
      });

      await Promise.all(deletePromises);
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error in deleteProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          images: 1,
          price: 1,
        },
      },
    ]);

    res.json(products);
  } catch (error) {
    console.log("Error in getRecommendedProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  const { gender, forAudience, size, minPrice, maxPrice } = req.query;

  const filter = { categoryId: category };

  if (gender) {
    filter.gender = parseInt(gender);
  }

  if (forAudience) {
    filter.for = parseInt(forAudience);
  }

  if (size) {
    filter[`size.${size}`] = { $exists: true };
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) {
      filter.price.$gte = parseFloat(minPrice);
    }
    if (maxPrice) {
      filter.price.$lte = parseFloat(maxPrice);
    }
  }

  try {
    const products = await Product.find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      products,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.log("Error in getProductsByCategory controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();
      await updateFeaturedProductsCache();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("Error in toggleFeaturedProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

async function updateFeaturedProductsCache() {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("error in update cache function");
  }
}
