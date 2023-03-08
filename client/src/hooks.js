import { useEffect, useState } from "react";

function useNotionStatus() {
  const [isConnected, setIsConnected] = useState(false);
  const [integrationType, setIntegrationType] = useState(null);
  const [isTokenStored, setIsTokenStored] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    try {
      fetch("/status")
        .then((res) => res.json())
        .then((data) => {
          setIsConnected(true);
          setIntegrationType(data.integrationType);
          setIsTokenStored(data.tokenRegistered);
          setIsTokenValid(data.validToken);
          setClientId(data.clientId);
        });
    } catch (error) {
      console.error("No connection to server");
    }
  }, []);
  return {
    isConnected,
    integrationType,
    isTokenStored,
    isTokenValid,
    clientId,
    setIsTokenStored,
    setIsTokenValid,
  };
}

function useUserInfo() {
  const { isConnected, isTokenValid } = useNotionStatus();
  const [user, setUser] = useState({});

  useEffect(() => {
    if (isConnected && isTokenValid) {
      fetch("/me")
        .then((res) => res.json())
        .then((data) => setUser(data));
    }
  }, [isConnected, isTokenValid]);
  return user;
}

function useLogin() {
  const { setIsTokenStored, setIsTokenValid } = useNotionStatus();
  const login = (code) => {
    console.log(`authorize code: ${code}`);
    fetch(`/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: code }),
    }).then((res) => {
      if (res.ok) {
        setIsTokenStored(true);
        setIsTokenValid(true);
      }
    });
  };

  return login;
}

function useLogout() {
  const { setIsTokenStored, setIsTokenValid } = useNotionStatus();

  const logout = () => {
    fetch("/logout", {
      method: "POST",
    }).then((res) => {
      if (res.ok) {
        setIsTokenStored(false);
        setIsTokenValid(false);
      }
    });
  };

  return logout;
}

export { useNotionStatus, useUserInfo, useLogin, useLogout };
