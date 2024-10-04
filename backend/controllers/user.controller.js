import { Address, User } from "../models/user.model.js";

export const getAddress = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user.id });
    res.status(200).json(addresses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching addresses", error: error.message });
  }
};

export const createAddress = async (req, res) => {
  try {
    const { address, city, country, pincode, name, contact } = req.body;
    const newAddress = new Address({
      userId: req.user.id,
      name,
      contact,
      address,
      city,
      country,
      pincode,
    });

    const savedAddress = await newAddress.save();
    res.status(201).json(savedAddress);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating address", error: error.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { id: addressId } = req.params;
    const { address, city, country, pincode, name, contact } = req.body;

    const updatedAddress = await Address.findOneAndUpdate(
      { _id: addressId, userId: req.user.id },
      {
        name,
        contact,
        address,
        city,
        country,
        pincode,
      },
      { new: true }
    );

    if (!updatedAddress) {
      return res
        .status(404)
        .json({ message: "Address not found or not authorized" });
    }

    res.status(200).json(updatedAddress);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating address", error: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { id: addressId } = req.params;
    const deletedAddress = await Address.findOneAndDelete({
      _id: addressId,
      userId: req.user.id,
    });

    if (!deletedAddress) {
      return res
        .status(404)
        .json({ message: "Address not found or not authorized" });
    }

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error deleting address", error: error.message });
  }
};

export const getMyWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate("wishList.product");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user.wishList);
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const toggleWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const existingWishlistItem = user.wishList.find(
      (item) => item.product.toString() === productId
    );

    if (existingWishlistItem) {
      user.wishList = user.wishList.filter(
        (item) => item.product.toString() !== productId
      );
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Product removed from wishlist",
        wishList: user.wishList,
      });
    } else {
      user.wishList.push({
        product: productId,
      });
      await user.save();

      return res.status(201).json({
        success: true,
        message: "Product added to wishlist",
        wishList: user.wishList,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
