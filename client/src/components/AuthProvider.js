import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
  const [clientId, setClientId] = useState();
  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setClientId(data.message));
  });
  const authorize = async (code) => {
    //fetch here
    fetch(`/login/${code}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data.message);
        console.log(user);
        setAuthed(true);
      });
  };
  const unauthorize = () => {
    setUser({});
    setAuthed(false);
  };

  return (
    <AuthContext.Provider
      value={{ clientId, authorize, authed, user, unauthorize }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
