
import { BrowserRouter as Router, HashRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar';

function App() {
  return (
  <Router>
    <Navbar>
      <Routes>
        <Route path='' element='' />
      </Routes>
      </Navbar>
    </Router>
  );
}

export default App;
