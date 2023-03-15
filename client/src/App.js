import { Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar-folder/Navbar";
import Navbar from "./components/NavBar-folder/Navbar";
import Projects from "./pages/Project";
import TimeRegistry from "./pages/TimeRegistry";
import TimeSummary from "./pages/TimePage/TimeSummary";
import TimeRegistry from "./pages/TimePage/TimeRegistry";
import TimeSummary from "./pages/TimePage/TimeSummary";
import Dev from "./pages/Dev";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<TimeSummary />} />
        <Route path="/Timesummary" element={<TimeSummary />} />
        <Route path="/Timesummary" element={<TimeSummary />} />
        <Route path="/timeregistry" element={<TimeRegistry />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/dev" element={<Dev />} />
      </Routes>
    </>
  );
}

export default App;
