import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'; // Import Navigate for redirect
import './components/CSS/Login.css';

// PAGE
import Home from './components/pages/Home';
import Report from './components/pages/Reports/Report';
import Controller from './components/pages/Controller';
import Login from './components/pages/Login/Login';
import SignUp from './components/pages/Login/Register';

function App() {
  
  return (
    <>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Dashboard" element={<Home />} />
          <Route path="/Report" element={<Report />} />
          <Route path="/Controller" element={<Controller />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
