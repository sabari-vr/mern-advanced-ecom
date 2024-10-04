import React, { useContext, createContext } from "react";
import { useImmer } from "use-immer";
import { getCookie } from "../../utils";

const AppContext = createContext();

export const AppScope = (props) => {
  const initial = {
    isAuthenticated: false,
    user: "",
    accessToken: "",
    refreshToken: "",
    registrationId: "",
    error: null,
  };

  const localData = JSON.parse(getCookie("_user_data"));

  const [AppState, setAppState] = useImmer(localData || initial);

  return (
    <AppContext.Provider
      value={{
        AppState,
        setAppState,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export const useAppScope = () => useContext(AppContext);
