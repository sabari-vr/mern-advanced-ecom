import { Axios } from "../../utils";

export const signup = async (payload) => {
  const res = await Axios.post("/auth/signup", payload);
  return res.data;
};

export const login = async (payload) => {
  const res = await Axios.post("/auth/login", payload);
  return res.data;
};

export const verifyEmail = async (code) => {
  const res = await Axios.post(`/auth//verify-email`, { code });
  return res.data;
};

export const getRefreshToken = async (payload) => {
  const res = await Axios.post(`/auth/refresh-token`, payload);
  return res.data;
};

export const forgotPassword = async (email) => {
  const res = await Axios.post(`/auth/forgot-password`, { email });
  return res.data;
};

export const resetPassword = async ({ token, password }) => {
  const res = await Axios.post(`/auth/reset-password/${token}`, { password });
  return res.data;
};

export const logout = async () => {
  const res = await Axios.post("/auth/logout");
  return res.data;
};

export const logoutFromAll = async () => {
  const res = await Axios.post("/auth/logout-from-all-device");
  return res.data;
};
