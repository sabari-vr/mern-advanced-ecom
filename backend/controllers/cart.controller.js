import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";

export const getCartProducts = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const products = await Product.find({ _id: { $in: user.cartItems } });

    const cartItems = products
      .map((product) => {
        const filteredItems = user.cartItems.filter(
          (cartItem) => cartItem.id.toString() === product.id
        );

        return filteredItems.map((item) => ({
          ...product.toJSON(),
          quantity: item.quantity,
          size: item.size,
        }));
      })
      .flat();
    res.json(cartItems);
  } catch (error) {
    console.log("Error in getCartProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getCartProductsById = async (req, res) => {
  try {
    const productItems = req.body;

    const productIds = productItems.map((item) => item.productId);

    const products = await Product.find({ _id: { $in: productIds } });

    const productMap = products.reduce((map, product) => {
      map[product._id.toString()] = product.toJSON();
      return map;
    }, {});

    const cartItems = productItems.map((item) => {
      const product = productMap[item.productId];

      return {
        ...product,
        quantity: item.quantity || 1,
        size: item.size || null,
      };
    });

    res.json(cartItems);
  } catch (error) {
    console.log("Error in getCartProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, size } = req.body;
    console.log(size);

    const user = await User.findById(req.user.id);

    const existingItem = user.cartItems.find(
      (item) => item.id === productId && item.size === size
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push({ _id: productId, size, quantity: 1 });
    }

    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.log("Error in addToCart controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { productId, size } = req.body;
    console.log(size);

    const user = await User.findById(req.user.id);
    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter((item) => {
        return !(item.id === productId && item.size === size);
      });
    }

    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity, size } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!product.size.hasOwnProperty(size)) {
      return res.status(400).json({ message: "Invalid size for this product" });
    }

    const existingItem = user.cartItems.find(
      (item) => item.id === productId && item.size === size
    );

    if (existingItem) {
      if (quantity < 1) {
        user.cartItems = user.cartItems.filter(
          (item) => !(item.id === productId && item.size === size)
        );
      } else {
        if (product.size[size] < quantity) {
          return res.status(400).json({
            message: "Not enough stock",
            availableStock: product.size[size],
          });
        }

        existingItem.quantity = quantity;
      }
      await user.save();
      return res.json(user.cartItems);
    } else {
      return res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    console.error("Error in updateQuantity controller", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
