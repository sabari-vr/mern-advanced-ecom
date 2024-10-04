import { Axios } from "../../utils";

export const getMyOrders = async () => {
  const res = await Axios.get(`/orders`);
  return res.data;
};

export const getAllOrders = async () => {
  const res = await Axios.get(`/orders/getAllOrders`);
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
