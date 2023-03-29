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

function App() {
  const signIn = useSignIn();
  const auth = useAuthUser();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tempCode, setTempCode] = useState(null);
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
        //axios.post("/api/login").then((res) => {
        //if (res.status === 200) {
        //if (
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
              id: "be285041-8cd0-4899-9f2d-c3867a3e3821",
              name: "Super Koala",
              role: "Super",
              notion_id: "0b4dd050-dd0e-4264-805e-5438e57b5c71",
              notion_name: "Koala Superuser",
              notion_email: "bjorn.agnemo@edu.edugrade.se",
            },
          },
        });
        //) {
        //console.log("Login success");
        //console.log(auth());
        //} else {
        //console.error("Login failed");
        //}
        //}
        //});
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
  }, [auth]);

  if (!isAuthenticated()) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Navbar />
      <p>
        Current User: {auth().person.name} Current Role: {auth().person.role}
      </p>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/Timesummary" element={<TimeSummary />} />
        <Route path="/timeregistry" element={<TimeRegistry />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/dev" element={<Dev />} />
      </Routes>
    </>
  );
}

export default App;
