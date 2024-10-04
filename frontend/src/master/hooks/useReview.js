import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  createProductReview,
  getProductForRateing,
  getProductReview,
} from "../api/review.api";
import { errorMessage, successMessage } from "../../utils";

export const useReview = ({ load = false, productId = null }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  const productListQuery = useQuery({
    queryKey: ["GET_PRODUCT_FOR_REVIEW"],
    queryFn: () => getProductForRateing(orderId),
    enabled: load,
  });

  const productReviewByIdQuery = useQuery({
    queryKey: ["GET_PRODUCT_FOR_REVIEW"],
    queryFn: () => getProductReview(productId),
    enabled: !!productId,
  });

  const createReviewMutation = useMutation({
    mutationFn: createProductReview,
    onSuccess: (data) => {
      successMessage(data.message);
      navigate(`/product/${productId}`);
    },
    onError: (e) => {
      errorMessage(e.response.data.message);
    },
  });

  return {
    productListQuery,
    productReviewByIdQuery,
    createReviewMutation,
  };
};
