import { createContext, useContext, useEffect, useState } from "react";
import { useNotionStatus, useUserInfo } from "../hooks";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
  const [isTokenStored, isTokenValid, clientId] = useNotionStatus();
  const user = useUserInfo();

  //const authorized = isTokenStored && isTokenValid;
  const authorize = async (code) => {
    //fetch here
    console.log(`authorize code: ${code}`);
    fetch(`/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: code }),
    }).then((res) => {
      if (res.ok) {
        //setAuthorized(true);
      }
    });
  };

  const unauthorize = () => {
    fetch("/logout", {
      method: "POST",
    }).then((res) => {
      if (res.ok) {
        //setAuthorized(false);
      }
    });
  };

  return (
    <AuthContext.Provider
      value={{
        authorize,
        authorized: isTokenStored && isTokenValid,
        clientId,
        user,
        unauthorize,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
