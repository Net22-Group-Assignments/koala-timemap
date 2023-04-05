import { Routes, Route, useNavigate, useSearchParams } from "react-router-dom";
import {
  useSignIn,
  useIsAuthenticated,
} from "react-auth-kit";
import { useEffect, useState } from "react";
import axios from "axios";

export const Login = () => {
  const signIn = useSignIn();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tempCode, setTempCode] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      axios
        .post("/api/login", {
          code: tempCode || searchParams.get("code"),
        })
        .then((res) => {
          console.log(res.data);
          if (
            res.data.registerStatus === "NOT_REGISTERED" ||
            res.data.registerStatus === "REGISTERED_INVALID"
          ) {
            window.location.replace(res.data.redirectUrl);
          } else {
            if (res.data.registerStatus === "REGISTERED_USER") {
              signIn({
                token: res.data.token,
                expiresIn: res.data.expiresIn,
                tokenType: "Bearer",
                authState: res.data.authState,
              });
              navigate("/timesummary");
            }
          }
        });
    } else {
      navigate("/timesummary");
    }
  }, []);

  return <></>;
};
