import { Routes, Route, useNavigate, useSearchParams } from "react-router-dom";
import {
  useAuthUser,
  useSignIn,
  useIsAuthenticated,
  RequireAuth,
} from "react-auth-kit";
import { useEffect, useState } from "react";
import axios from "axios";
import { useTreasure } from "react-treasure";

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
            // This should be replaced with a better modal.
            // const tc = prompt("Enter temporary code, cancel to register.");
            // if (!tc) {
            window.location.replace(res.data.redirectUrl);
            // }
            // setTempCode(tc);
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
