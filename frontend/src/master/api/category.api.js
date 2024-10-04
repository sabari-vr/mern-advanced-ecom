import { Axios } from "../../utils";

export const getProductsByCategory = async (category) => {
  const res = await Axios.get(`/products/category/${category}`);
  return res.data;
};

export const createCategory = async (formData) => {
  const res = await Axios.post("/categories", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const getCategories = async () => {
  const res = await Axios.get("/categories");
  return res.data;
};

export const getCategoryById = async (id) => {
  const res = await Axios.get(`/categories/${id}`);
  return res.data;
};

export const updateCategory = async ({ id, formData }) => {
  const res = await Axios.put(`/categories/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await Axios.delete(`/categories/${id}`);
  return res.data;
};
