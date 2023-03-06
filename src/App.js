import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Dashboard, Team, Projects, Calendar } from "./pages";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/team" element={<Team />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </div>
  );
}

export default App;
