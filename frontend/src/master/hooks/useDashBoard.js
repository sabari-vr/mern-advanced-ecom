import React from "react";
import { getAnalyticsData } from "../api";
import { useQuery } from "@tanstack/react-query";

export const useDashBoard = ({ load = false }) => {
  const getAnalyticsDataQuery = useQuery({
    queryKey: ["GET_ANALITICS"],
    queryFn: getAnalyticsData,
    enabled: load,
  });

  return {
    getAnalyticsDataQuery,
  };
};
