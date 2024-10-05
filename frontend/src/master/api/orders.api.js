import { Axios } from "../../utils";

export const getMyOrders = async (page) => {
  const res = await Axios.get(`/orders?page=${page}&limit=5`);
  return res.data;
};

export const getAllOrders = async (page) => {
  const res = await Axios.get(`/orders/getAllOrders?page=${page}&limit=5`);
  return res.data;
};

export const cancelOrder = async (id) => {
  const res = await Axios.patch(`/orders/cancel/${id}`);
  return res.data;
};

export const updateOrderStatus = async ({ id, status }) => {
  const res = await Axios.patch(`/orders/update-status/${id}`, {
    status: status,
  });
  return res.data;
};
