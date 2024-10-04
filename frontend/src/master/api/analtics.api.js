import { Axios } from "../../utils";

export const getAnalyticsData = async () => {
  const res = await Axios.get(`/analtics/get-analytics-data`);
  return res.data;
};
