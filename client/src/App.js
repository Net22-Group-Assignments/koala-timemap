import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Projects from "./pages/Project";
import TimeRegistry from "./pages/TimeRegistry";
import TimeSummary from "./pages/TimeSummary";
import { useAuth } from "./components/AuthProvider";
import Dev from "./pages/Dev";
import { useEffect } from "react";

function App() {
  const { isConnected, integrationType, authorized, authorize, clientId } =
    useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (integrationType === "public" && isConnected && !authorized) {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      console.log(`code from params: ${code}`);
      if (code) {
        (async function () {
          await authorize(code);
        })();
        navigate("/", { replace: true });
      }
    }
  }, [isConnected, authorized]);

  if (!isConnected) return <div>No connection to server</div>;

  if (!authorized)
    return (
      <div className="App">
        <a
          style={{ display: "block" }}
          href={`https://api.notion.com/v1/oauth/authorize?client_id=${clientId}&response_type=code&owner=user`}
        >
          Connect to Notion
        </a>
      </div>
    );

  return (
    <>
      <Navbar>
        <Routes>
          <Route path="/" element={<TimeSummary />} />
          <Route path="/timesummary" element={<TimeSummary />} />
          <Route path="/timeregistry" element={<TimeRegistry />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/dev" element={<Dev />} />
        </Routes>
      </Navbar>
    </>
  );
}

export default App;
