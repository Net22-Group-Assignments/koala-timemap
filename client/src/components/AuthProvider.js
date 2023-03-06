import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
  const [clientId, setClientId] = useState("");
  const [authed, setAuthed] = useState(false);
  const [user, setUser] = useState("");
  const [secret, setSecret] = useState("");

  useEffect(() => {
    fetch("/status")
      .then((res) => res.json())
      .then((data) => {
        const status = data.tokenRegistered;
        console.log(status);
        setAuthed(status);
      });
    if (!authed) {
      fetch("/clientId")
        .then((res) => res.text())
        .then((data) => {
          console.log(data);
          setClientId(data);
        });
    }
  }, []);

  const authorize = async (code) => {
    //fetch here
    console.log(`authorize code: ${code}`);
    await fetch(`/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: code }),
    })
      .then((res) => res.json())
      .then((data) => {
        setSecret(data.accessToken);
        console.log(secret);
        setAuthed(true);
      });
  };
  const unauthorize = () => {
    setUser({});
    setAuthed(false);
    setSecret("");
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
