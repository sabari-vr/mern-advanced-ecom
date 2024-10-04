import { Axios } from "../../utils";

export const getCart = async () => {
  const res = await Axios.get(`/cart`);
  return res.data;
};

export const getRecommendations = async () => {
  const res = await Axios.get(`/products/recommendations`);
  return res.data;
};

export const addToCart = async ({ product, size }) => {
  const res = await Axios.post(`/cart`, { productId: product._id, size });
  return res.data;
};

export const removeAllFromCart = async ({ productId, size }) => {
  const res = await Axios.delete(`/cart`, {
    data: { productId, size },
  });
  return res.data;
};

export const updateQnty = async ({ id, quantity, size }) => {
  const res = await Axios.put(`/cart/${id}`, {
    quantity: quantity,
    size: size,
  });
  return res.data;
};

export const getSingleCart = async (payload) => {
  const res = await Axios.post(`/cart/create-single-order`, payload);
  return res.data;
};
