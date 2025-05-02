import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom'; // Use Routes instead of Switch
// import { ToastContainer } from "react-toastify";

//PAGE
import Home from './components/pages/Home';
import Report from './components/pages/Reports/Report';
// import Sungai from './components/pages/Reports/Sungai'
import Controller from './components/pages/Controller';
// import Login from './pages/Login/Login';
// import Signup from "./components/pages/Login/Register";

//KOMPONEN
import Sidenav from './components/Sidenav';

function App() {
  return (
    <>
    <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
      <BrowserRouter>
      <Routes> 
        {/* Login */}
        {/* <Route path="/Login" element={<Login/>} />
        <Route path="/Register" element={<Signup/>} /> */}

        {/* Dashboard */}
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Dashboard" element={<Home />} /> 
        <Route path="/Report" element={<Report />} />
        <Route path="/Controller" element={<Controller />} /> 
      </Routes>
    {/* <ToastContainer /> */}
    </BrowserRouter>
    </> 
  );
}

export default App;
