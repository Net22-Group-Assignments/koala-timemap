import { useEffect, useState } from "react";

function useNotionStatus() {
  const [isTokenStored, setIsTokenStored] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    fetch("/status")
      .then((res) => res.json())
      .then((data) => {
        setIsTokenStored(data.tokenRegistered);
        setIsTokenValid(data.validToken);
        setClientId(data.clientId);
      });
  }, []);
  return [isTokenStored, isTokenValid, clientId];
}

function useUserInfo() {
  const isTokenValid = useNotionStatus();
  const [user, setUser] = useState({});

  useEffect(() => {
    if (isTokenValid) {
      fetch("/me")
        .then((res) => res.json())
        .then((data) => setUser(data));
    }
  });
  return user;
}

export { useNotionStatus, useUserInfo };
