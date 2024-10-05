import React from "react";
import {
  cancelOrder,
  getAllOrders,
  getMyOrders,
  updateOrderStatus,
} from "../api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useImmer } from "use-immer";

export const useOrders = ({ isAdmin = false, load = false }) => {
  const queryClient = useQueryClient();
  const [page, setPage] = useImmer(1);
  const getOrdersQuery = useQuery({
    queryKey: ["GET_ORDERS", isAdmin, page],
    queryFn: isAdmin ? () => getAllOrders(page) : () => getMyOrders(page),
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

  const { data, isLoading } = getOrdersQuery;
  const { orders, pagination } = !!data && data;

  return {
    orders,
    pagination,
    isLoading,
    cancelOrderMutation,
    updateOrderStatusMutation,
    setPage,
    page,
  };
};
