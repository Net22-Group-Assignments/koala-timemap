import { Routes, Route, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "./components/NavBar-folder/Navbar";
import FrontPage from "./pages/FrontPage/FrontPage";
import Projects from "./pages/Project";
import TimeRegistry from "./pages/TimePage/TimeRegistry";
import TimeSummary from "./pages/TimePage/TimeSummary";
import Dev from "./pages/Dev";
import {
  useAuthUser,
  useSignIn,
  useIsAuthenticated,
  RequireAuth,
} from "react-auth-kit";
import { useEffect, useState } from "react";
import axios from "axios";
import { useTreasure } from "react-treasure";
import { Login } from "./pages/Login";

function App() {
  useSignIn();
  const auth = useAuthUser();
  useAuthUser();
  useIsAuthenticated();
  const [statusValues, setStatusValues] = useTreasure("status-values");
  /*React will output following warning:
    'Warning: Cannot update a component (`AuthProvider`)
    while rendering a different component (`App`)'

    The "autologin" that fires during rendering will be removed when
    proper login is done so this warning will not
    persist into production code.
    */

  useEffect(() => {

    // Check if statusValues is set, if not fetch them from the server
    if (!statusValues) {
      axios.get("/api/projects/statusvalues").then((res) => {
        setStatusValues(res.data);
      });
    }
  }, [auth]);

  // if (!isAuthenticated()) {
  //   return <div>Loading...</div>;
  // }
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/timesummary"
          element={
            <RequireAuth loginPath={"/"}>
              <TimeSummary />
            </RequireAuth>
          }
        />
        {/*<Route path="/timeregistry" element={<TimeRegistry />} />*/}
        {/*<Route path="/projects" element={<Projects />} />*/}
        <Route path="/dev" element={<Dev />} />
      </Routes>
    </>
  );
}

export default App;
