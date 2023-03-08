import { createContext, useContext } from "react";
import { useLogin, useLogout, useNotionStatus, useUserInfo } from "../hooks";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
  const {
    isConnected,
    isTokenStored,
    isTokenValid,
    clientId,
    integrationType,
  } = useNotionStatus();
  const login = useLogin();
  const logout = useLogout();
  const user = useUserInfo();
  const authorize = async (code) => await login(code);
  const unauthorize = async () => await logout();

  return (
    <AuthContext.Provider
      value={{
        isConnected,
        integrationType,
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
