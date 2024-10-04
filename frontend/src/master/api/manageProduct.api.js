import { Axios } from "../../utils";

export const createProduct = async (payload) => {
  const res = await Axios.post("/products", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateProduct = async ({ id, formData }) => {
  const res = await Axios.put(`/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const getAllProducts = async () => {
  const res = await Axios.get("/products");
  return res.data;
};

export const getFeaturedProduct = async () => {
  const res = await Axios.get("/products/featured");
  return res.data;
};

export const getProductsByID = async (id) => {
  const res = await Axios.get(`/products/${id}`);
  return res.data;
};

export const deleteProductFn = async (id) => {
  const res = await Axios.delete(`/products/${id}`);
  return res.data;
};

export const toogleFeaturedProduct = async (id) => {
  const res = await Axios.patch(`/products/${id}`);
  return res.data;
};
