import { Axios } from "../../utils";

export const getProductForRateing = async (orderId) => {
  const res = await Axios.get(`/review/get-order/${orderId}`);
  return res.data;
};

export const getProductReview = async (productId) => {
  const res = await Axios.get(`/review/${productId}`);
  return res.data;
};

export const createProductReview = async (payload) => {
  const res = await Axios.post(`/review/`, payload);
  return res.data;
};
