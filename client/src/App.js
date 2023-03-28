import { Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar-folder/Navbar";
import FrontPage from "./pages/FrontPage/FrontPage";
import Projects from "./pages/Project";
import TimeRegistry from "./pages/TimePage/TimeRegistry";
import TimeSummary from "./pages/TimePage/TimeSummary";
import Dev from "./pages/Dev";
import { useAuthUser, useSignIn, useIsAuthenticated } from "react-auth-kit";
import { useEffect } from "react";
import axios from "axios";

function App() {
  const signIn = useSignIn();
  const auth = useAuthUser();
  const isAuthenticated = useIsAuthenticated();

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
      process.env.REACT_APP_INTEGRATION_TYPE === "internal"
    ) {
      if (!isAuthenticated()) {
        axios.post("/api/login").then((res) => {
          if (res.status === 200) {
            if (
              signIn({
                token: res.data.token,
                expiresIn: res.data.expiresIn,
                tokenType: "string",
                authState: res.data.authState,
              })
            ) {
              console.log("Login success");
              console.log(auth());
            } else {
              console.error("Login failed");
            }
          }
        });
      }
    }
  }, []);

  return (
    <>
      <Navbar />
      {isAuthenticated() && (
        <p>
          Current User: {auth().person.name} Current Role: {auth().person.role}
        </p>
      )}
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
