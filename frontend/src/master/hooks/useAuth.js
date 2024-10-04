import React from "react";
import { useMutation } from "@tanstack/react-query";
import {
  login,
  logout,
  logoutFromAll,
  verifyEmail,
  signup,
  useAppScope,
  forgotPassword,
  resetPassword,
} from "..";
import {
  errorMessage,
  removeCookie,
  setCookie,
  successMessage,
  clearHistoryAndRedirect,
} from "../../utils";
import { useImmer } from "use-immer";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useImmer({
    name: "",
    email: "",
    password: "",
  });

  const { setAppState } = useAppScope();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data.accessToken) {
        setAppState((draft) => data);
        const { refreshToken, accessToken, user } = data;
        const userData = {
          refreshToken,
          accessToken,
          user: user,
        };
        setCookie("_user_data", JSON.stringify(userData));
        successMessage(data.message);
        navigate("/", { replace: true });
      }
    },
    onError: (e) => {
      if (e?.response?.status === 403) {
        navigate("/verify-email");
      } else {
        errorMessage(e.response.data.message);
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      successMessage(data.message);
      navigate("/verify-email");
    },
    onError: (e) => {
      errorMessage(e.response.data.message);
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: verifyEmail,
    onSuccess: (data) => {
      if (data.accessToken) {
        setAppState((draft) => data);
        const { refreshToken, accessToken, user } = data;
        const userData = {
          refreshToken,
          accessToken,
          user: user,
        };
        setCookie("_user_data", JSON.stringify(userData));
        navigate("/", { replace: true });
        successMessage(data.message);
      }
    },
    onError: (e) => {
      errorMessage(e.response.data.message);
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      successMessage(data.message);
    },
    onError: (e) => {
      errorMessage(e.response.data.message);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      navigate("/login", { replace: true });
      successMessage(data.message);
    },
    onError: (e) => {
      errorMessage(e.response.data.message);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      successMessage(data.message);
      clearHistoryAndRedirect("/");
      removeCookie("_user_data");
    },
    onError: (e) => {
      errorMessage(e.response.data.message);
    },
  });

  const logoutFromAllMutation = useMutation({
    mutationFn: logoutFromAll,
    onSuccess: (data) => {
      successMessage(data.message);
      clearHistoryAndRedirect("/login");
      removeCookie("_user_data");
    },
    onError: (e) => {
      errorMessage(e.response.data.message);
    },
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setUser((draft) => {
      draft[name] = value;
      return draft;
    });
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleLogoutFromAll = () => {
    logoutFromAllMutation.mutate();
  };

  return {
    user,
    loginMutation,
    registerMutation,
    verifyEmailMutation,
    forgotPasswordMutation,
    resetPasswordMutation,
    onChange,
    handleLogout,
    handleLogoutFromAll,
  };
};
