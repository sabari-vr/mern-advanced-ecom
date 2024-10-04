import { getCookie } from "../utils";
import toast from "react-hot-toast";

export const getLocalUserData = () => {
  var localUser = JSON.parse(getCookie("_user_data"));
  return localUser;
};

export const successMessage = async (text) => {
  if (text === null || text === undefined || text === "")
    text = "Data saved successfully!";
  return toast.success(text);
};

export const errorMessage = async (text) => {
  if (text === null || text === undefined || text === "") text = "Error";
  toast.error(text);
};

export const clearHistoryAndRedirect = (redirectTo) => {
  window.history.pushState(null, null, redirectTo);
  window.location.replace(redirectTo);
};
