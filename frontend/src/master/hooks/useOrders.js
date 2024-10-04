import React from "react";
import {
  cancelOrder,
  getAllOrders,
  getMyOrders,
  updateOrderStatus,
} from "../api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useOrders = ({ isAdmin = false, load = false }) => {
  const queryClient = useQueryClient();
  const getOrdersQuery = useQuery({
    queryKey: ["GET_ORDERS", isAdmin],
    queryFn: isAdmin ? getAllOrders : getMyOrders,
    enabled: load,
  });

  const cancelOrderMutation = useMutation({
    mutationFn: cancelOrder,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["GET_ORDERS", isAdmin] });
      successMessage(data.message);
    },
    onError: (e) => {
      errorMessage(e.response.data.message);
    },
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["GET_ORDERS", isAdmin] });
      successMessage(data.message);
    },
    onError: (e) => {
      errorMessage(e.response.data.message);
    },
  });

  const { data: orders, isLoading } = getOrdersQuery;

  return {
    orders,
    isLoading,
    cancelOrderMutation,
    updateOrderStatusMutation,
  };
};
