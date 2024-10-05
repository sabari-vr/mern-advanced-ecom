import React, { useState } from "react";
import {
  getProductsByCategory,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getFeaturedProduct,
} from "..";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useImmer } from "use-immer";
import { errorMessage, successMessage } from "../../utils";

export const useCategory = ({ categoryId = null, load = false }) => {
  const genderOptions = [
    { value: 0, label: "Male" },
    { value: 1, label: "Female" },
    { value: 2, label: "Gender Neutral" },
  ];

  const forOptions = [
    { value: 0, label: "Adult" },
    { value: 1, label: "Kids" },
    { value: 2, label: "All" },
  ];

  const sizeOptions = [
    { value: "XS", label: "Extra Small (XS)" },
    { value: "S", label: "Small (S)" },
    { value: "M", label: "Medium (M)" },
    { value: "L", label: "Large (L)" },
    { value: "XL", label: "Extra Large (XL)" },
    { value: "XXL", label: "2X Large (XXL)" },
    { value: "XXXL", label: "3X Large (XXXL)" },
    { value: "XXXXL", label: "4X Large (XXXXL)" },
    { value: "FREE", label: "Free Size" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10" },
    { value: "11", label: "11" },
    { value: "12", label: "12" },
    { value: "30", label: "30" },
    { value: "32", label: "32" },
    { value: "34", label: "34" },
    { value: "36", label: "36" },
    { value: "38", label: "38" },
    { value: "40", label: "40" },
    { value: "42", label: "42" },
    { value: "44", label: "44" },
    { value: "46", label: "46" },
    { value: "48", label: "48" },
    { value: "50", label: "50" },
  ];

  const [editingId, setEditingId] = useState(null);
  const [previewImages, setPreviewImages] = useImmer(false);
  const [previewImagesEdit, setPreviewImagesEdit] = useImmer(false);
  const [pagination, setPagination] = useImmer({
    page: 1,
    limit: 4,
    selectedGender: "",
    selectedFor: "",
    selectedSize: "",
    priceRange: [0, 10000],
  });
  const [editName, setEditName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const queryClient = useQueryClient();

  const productListQuery = useQuery({
    queryKey: ["GET_PRODUCTS_BY_CATEGORY", categoryId, pagination],
    queryFn: () => getProductsByCategory({ categoryId, pagination }),
    enabled: !!categoryId,
  });

  console.log(!!categoryId);

  const feturedProductListQuery = useQuery({
    queryKey: ["GET_FEATURED_PRODUCTS"],
    queryFn: getFeaturedProduct,
    enabled: load,
  });

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    enabled: load,
  });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: (data) => {
      successMessage(data.message);
      setNewCategoryName("");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (e) => {
      errorMessage(e.response.data.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: (data) => {
      successMessage(data.message);
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (e) => {
      errorMessage(e.response.data.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: (data) => {
      successMessage(data.message);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (e) => {
      errorMessage(e.response.data.message);
    },
  });

  const handleEdit = (category) => {
    setEditingId(category._id);
    setEditName(category.name);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();

      formData.append("data", JSON.stringify({ name: editName }));
      if (previewImagesEdit) {
        const base64Images = await Promise.all(
          previewImagesEdit.map(async (image) => {
            const base64 = await fileToBase64(image.file);
            return {
              name: image.file.name,
              type: image.file.type,
              base64: base64,
            };
          })
        );
        formData.append("images", JSON.stringify(base64Images));
      }
      updateMutation.mutate({ id: editingId, formData });
    } catch (error) {
      console.error("Error adding category:", error);
      errorMessage("Failed to update category");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteMutation.mutate(id);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAdd = async () => {
    if (!previewImages || previewImages.length === 0) {
      return errorMessage("Image is mandatory");
    }

    if (newCategoryName.trim()) {
      try {
        const formData = new FormData();

        formData.append("data", JSON.stringify({ name: newCategoryName }));

        const base64Images = await Promise.all(
          previewImages.map(async (image) => {
            const base64 = await fileToBase64(image.file);
            return {
              name: image.file.name,
              type: image.file.type,
              base64: base64,
            };
          })
        );

        formData.append("images", JSON.stringify(base64Images));

        createMutation.mutate(formData);
      } catch (error) {
        console.error("Error adding category:", error);
        errorMessage("Failed to create category");
      }
    } else {
      errorMessage("Category name cannot be empty");
    }
  };

  return {
    productListQuery,
    categories,
    isLoading,
    handleAdd,
    handleSave,
    handleDelete,
    handleEdit,
    editingId,
    newCategoryName,
    setNewCategoryName,
    setEditingId,
    setEditName,
    editName,
    previewImages,
    setPreviewImages,
    feturedProductListQuery,
    previewImagesEdit,
    setPreviewImagesEdit,
    setPagination,
    pagination,
    sizeOptions,
    forOptions,
    genderOptions,
  };
};
