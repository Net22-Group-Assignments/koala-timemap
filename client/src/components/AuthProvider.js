import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
  const [clientId, setClientId] = useState("");
  const [authed, setAuthed] = useState(false);
  //const [user, setUser] = useState({});

  useEffect(async () => {
    const status = await fetch("/status")
        .then((res) => res.json())
        .then((data) => data.message);
    if (status) {
      setAuthed(status);
      return;
    }

    fetch("/api")
      .then((res) => res.text())
      .then((data) => setClientId(data));
  });
  const authorize = async (code) => {
    //fetch here
    await fetch(`/login`, {
      method: "POST",
          headers: {
      "Content-Type": "text/plain",
      body: code
    });
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
