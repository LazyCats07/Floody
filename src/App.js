import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Perbaiki impor BrowserRouter
import './components/CSS/Login.css';

// PAGE
import Home from './components/pages/Home';
import Report from './components/pages/Reports/Report';
import Controller from './components/pages/Controller';
import Login from './components/pages/Login/Login';
import SignUp from './components/pages/Login/Register';


//KOMPONEN
// Import hanya komponen yang diperlukan untuk aplikasi
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Dashboard" element={<Home />} />
          <Route path="/Report" element={<Report />} />
          <Route path="/Controller" element={<Controller />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<SignUp />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
