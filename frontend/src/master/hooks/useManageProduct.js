import React, { useEffect } from "react";
import {
  createProduct,
  deleteProductFn,
  getAllProducts,
  getCategories,
  getProductsByID,
  toogleFeaturedProduct,
  updateProduct,
} from "..";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useImmer } from "use-immer";
import { useNavigate } from "react-router-dom";
import { successMessage } from "../../utils";

export const useManageProduct = ({ productId = null, load = false }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const initalProductValue = {
    name: "",
    description: "",
    price: "",
    categoryId: "",
    gender: "",
    for: "",
    images: [],
    size: false,
    color: "",
    batchId: "",
  };

  const sizes = [
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "30",
    "32",
    "34",
    "36",
    "38",
    "40",
    "42",
    "44",
    "46",
    "48",
    "50",
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "XXXL",
    "XXXXL",
    "FREE",
  ];

  const [newProduct, setNewProduct] = useImmer(initalProductValue);
  const [previewImages, setPreviewImages] = useImmer([]);
  const [sizeStock, setSizeStock] = useImmer(
    sizes.reduce((acc, size) => ({ ...acc, [size]: 0 }), {})
  );

  const productListQuery = useQuery({
    queryKey: ["GET_PRODUCT_LIST"],
    queryFn: getAllProducts,
    enabled: true,
  });

  const catagoryListQuery = useQuery({
    queryKey: ["GET_CATAGORY_LIST"],
    queryFn: getCategories,
    enabled: load,
  });

  const { data: categories = [] } = catagoryListQuery;

  const productByIdQuery = useQuery({
    queryKey: ["GET_PRODUCT_BY_ID"],
    queryFn: () => getProductsByID(productId),
    enabled: !!productId,
  });

  useEffect(() => {
    if (productByIdQuery.data && !productByIdQuery.isLoading) {
      const {
        data: { product: data },
      } = productByIdQuery;
      if (!!data) {
        setNewProduct((draft) => {
          draft.name = data.name;
          draft.description = data.description;
          draft.price = data.price;
          draft.categoryId = data.categoryId;
          draft.size = data.size;
          draft.color = data.color;
          draft.batchId = data.batchId;
          draft.for = data.for;
          draft.gender = data.gender;
          return draft;
        });
      }

      const newImgFormat = data?.images?.map((element) => ({
        url: element,
        file: "",
      }));
      setPreviewImages((draft) => {
        draft = newImgFormat;
        return draft;
      });
      const sizes = data.size;

      setSizeStock(
        Object.keys(sizes).reduce(
          (acc, size) => ({
            ...acc,
            [size]: parseInt(sizes[size], 10),
          }),
          {}
        )
      );
    }
  }, [productByIdQuery.data]);

  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: (data) => {
      setNewProduct(initalProductValue);
      setPreviewImages([]);
      setSizeStock(sizes.reduce((acc, size) => ({ ...acc, [size]: 0 }), {}));
      successMessage(data.message);
      navigate("/secret-dashboard/products", { replace: true });
    },
    onError: (e) => {
      errorMessage(e.response.data.message);
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: (data) => {
      setNewProduct(initalProductValue);
      setPreviewImages([]);
      setSizeStock(sizes.reduce((acc, size) => ({ ...acc, [size]: 0 }), {}));
      successMessage(data.message);
      navigate("/secret-dashboard/products", { replace: true });
    },
    onError: (e) => {
      errorMessage(e.response.data.message);
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProductFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["GET_PRODUCT_LIST"] });
      successMessage(data.message);
    },
    onError: (e) => {
      errorMessage(e.response.data.message);
    },
  });

  const tootleFeaturedProductMutation = useMutation({
    mutationFn: toogleFeaturedProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["GET_PRODUCT_LIST"] });
      successMessage(data.message);
    },
    onError: (e) => {
      errorMessage(e.response.data.message);
    },
  });

  const deleteProduct = (id) => {
    deleteProductMutation.mutate(id);
  };
  const toggleFeaturedProduct = (id) => {
    tootleFeaturedProductMutation.mutate(id);
  };

  return {
    createProductMutation,
    newProduct,
    setNewProduct,
    deleteProduct,
    toggleFeaturedProduct,
    previewImages,
    setPreviewImages,
    productListQuery,
    sizeStock,
    setSizeStock,
    categories,
    sizes,
    updateProductMutation,
    productByIdQuery,
  };
};
