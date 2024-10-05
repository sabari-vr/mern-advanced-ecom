import { Axios } from "../../utils";

export const getProductsByCategory = async ({ categoryId, pagination }) => {
  const { page, limit, selectedGender, selectedFor, selectedSize, priceRange } =
    pagination;

  try {
    const res = await Axios.get(
      `/products/category/${categoryId}?page=${page}&limit=${limit}&gender=${selectedGender}&forAudience=${selectedFor}&size=${selectedSize}&minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}`
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
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
