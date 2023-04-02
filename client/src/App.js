import { Routes, Route, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "./components/NavBar-folder/Navbar";
import FrontPage from "./pages/FrontPage/FrontPage";
import Projects from "./pages/Project";
import TimeRegistry from "./pages/TimePage/TimeRegistry";
import TimeSummary from "./pages/TimePage/TimeSummary";
import Dev from "./pages/Dev";
import { useAuthUser, useSignIn, useIsAuthenticated } from "react-auth-kit";
import { useEffect, useState } from "react";
import axios from "axios";
import { useTreasure } from "react-treasure";

function App() {
  const signIn = useSignIn();
  const auth = useAuthUser();
  const authHeader = useAuthUser();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tempCode, setTempCode] = useState(null);
  const [statusValues, setStatusValues] = useTreasure("status-values");
  /*React will output following warning:
    'Warning: Cannot update a component (`AuthProvider`)
    while rendering a different component (`App`)'

    The "autologin" that fires during rendering will be removed when
    proper login is done so this warning will not
    persist into production code.
    */

  useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" &&
      process.env.REACT_APP_INTEGRATION_TYPE !== "public"
    ) {
      if (!isAuthenticated()) {
        signIn({
          token: process.env.REACT_APP_NOTION_API_KEY_ID,
          expiresIn: 60,
          tokenType: "string",
          authState: {
            integration: {
              id: "16eb2615-67cb-49af-8adb-8f9036cc9144",
              type: "internal",
            },
            person: {
              id: "245df54e-41b9-46f8-a13c-142c6ee7c52f",
              name: "Oskar Åhling",
              role: "Big Boss",
              notion_id: "901e01bb-f221-48dd-a233-b368a1c004f8",
              notion_name: "Oskar",
              notion_email: "oskar.ahling@edu.edugrade.se",
              avatar_url:
                "https://s3-us-west-2.amazonaws.com/public.notion-static.com/fea34a59-d0fd-4a31-a5eb-fb4d178fa527/koala-logo.png",
            },
          },
        });
      }
    } else {
      /*
       * Plan is the following: 1 Post to login with a code
       * Then if that code is empty or invalid the registerprocess
       * starts with a redirect to the notion token registerpage
       * If it is successful Then the code is sent via a redirect to this app
       * that code is now posted to the server login once again to
       * authenticate and save an authstate in localstorage
       * */
      if (!isAuthenticated()) {
        axios
          //.post(`/api/login?code=f2bb83cf-6da0-4f00-9bd8-dc6cfa6940f7`)
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
              const tc = prompt("Enter temporary code, cancel to register.");
              if (!tc) {
                window.location.replace(res.data.redirectUrl);
              }
              setTempCode(tc);
            } else {
              if (res.data.registerStatus === "REGISTERED_USER") {
                signIn({
                  token: res.data.token,
                  expiresIn: res.data.expiresIn,
                  tokenType: "Bearer",
                  authState: res.data.authState,
                });
              }
            }
          });
      }
    }
    // Check if statusValues is set, if not fetch them from the server
    if (!statusValues) {
      axios.get("/api/projects/statusvalues").then((res) => {
        setStatusValues(res.data);
      });
    }
  }, [auth]);

  if (!isAuthenticated()) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/timesummary" element={<TimeSummary />} />
        {/*<Route path="/timeregistry" element={<TimeRegistry />} />*/}
        {/*<Route path="/projects" element={<Projects />} />*/}
        <Route path="/dev" element={<Dev />} />
      </Routes>
    </>
  );
}

export default App;
