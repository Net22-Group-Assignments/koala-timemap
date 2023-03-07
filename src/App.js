
import { BrowserRouter as Router, HashRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar';
import Projects from './pages/Project';
import TimeRegistry from './pages/TimeRegistry';
import TimeSummary from './pages/TimeSummary';

function App() {
  return (
    <Router>

      <Navbar>
        <Routes>
          <Route path='/projects' element={<Projects />} />
          <Route path='/timeregistry' element={<TimeRegistry />} />
          <Route path='/timesummary' element={<TimeSummary />} />
        </Routes>
      </Navbar>
    </Router>

  );
}

export default App;
