import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addToCart, getSingleCart, removeAllFromCart, updateQnty } from "..";
import { errorMessage, successMessage } from "../../utils";
import { useSearchParams } from "react-router-dom";

export const useCart = ({ load = true }) => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const products = JSON.parse(searchParams.get("products"));

  const cartListQuery = useQuery({
    queryKey: ["GET_SINGLE_CART_CATEGORY"],
    queryFn: () => getSingleCart(products),
    enabled: load,
  });

  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["GET_CART"] });
      successMessage(data.message);
    },
    onError: (e) => {
      errorMessage(e.response.data.message);
    },
  });

  const updateQuantityCartMutation = useMutation({
    mutationFn: updateQnty,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["GET_CART"] });
      successMessage(data.message);
    },
    onError: (e) => {
      errorMessage(e.response.data.message);
    },
  });

  const removeAllFromCartMutation = useMutation({
    mutationFn: removeAllFromCart,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["GET_CART"] });
      successMessage(data.message);
    },
    onError: (e) => {
      errorMessage(e.response.data.message);
    },
  });

  return {
    addToCartMutation,
    updateQuantityCartMutation,
    removeAllFromCartMutation,
    cartListQuery,
  };
};
