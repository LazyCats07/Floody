import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './components/CSS/Login.css';
import loadingGif from './components/icon/loading-unscreen.gif';
import NFound from './components/icon/notFound.gif';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from '@vercel/speed-insights/react';
import Notification from './components/notification';

// PAGE
import Home from './components/pages/Home';
import Report from './components/pages/Reports/Report';
import Controller from './components/pages/Controller';
import Login from './components/pages/Login/Login';
import SignUp from './components/pages/Login/Register';
import ForgotPass from './components/pages/Login/ForgotPass';
// import LandingPage from './components/pages/LandingPage/LandingPage'

// Firebase Authentication
import { auth } from './components/firebase-config';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from 'react';

// Komponen PrivateRoute untuk melindungi route yang membutuhkan autentikasi
function PrivateRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);  // Set loading to false after checking the auth status
    });

    // Set timeout to redirect to login if auth status is still unknown after 5 seconds
    const timeout = setTimeout(() => {
      if (loading) {
        setUser(null);  // User is not authenticated, redirect to login
        setLoading(false);  // Set loading to false
      }
    }, 5000);  // Timeout after 5 seconds

    return () => {
      clearTimeout(timeout);  // Clear timeout when component unmounts
      unsubscribe();
    };
  }, [loading]);

  if (loading) {
    return (
      <div  className='con-loading'>
      <img src={loadingGif} alt="loading" className='loading' />
      </div>
    )  // Menampilkan loading jika status autentikasi belum diketahui
  }

  return user ? children : <Navigate to="/Login" replace />;  // Jika user belum login, arahkan ke halaman login
}

// Fungsi Logout
const logout = async () => {
  try {
    await signOut(auth);  // Logout dari Firebase
    window.location.replace("/Login");  // Redirect ke halaman login menggunakan window.location.replace -- TEST
  } catch (error) {
    console.error("Error during logout", error);
  }
};

// 404 Page
function NotFound() {
  return (
    <>
      {/* Menggunakan Fragment untuk membungkus kedua elemen */}
      <div style={{textAlign: 'center', color: 'gray', fontSize: '50px', marginTop: '20%' }} className='not-found' > 
        <img src={NFound} alt="Not Found" className='not-foundLogo'/>
        404 Not Found
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      {/* Komponen SpeedInsights untuk mengumpulkan data kecepatan */}
      <SpeedInsights />
      {/* Komponen Analytics untuk mengumpulkan data analitik */}
      <Analytics/>
      <Routes>
        {/* Public Routes */}
        {/* <Route path="/" element={<LandingPage />} /> */}
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/ForgotPass" element={<ForgotPass />} />
        
        
        {/* Protected Routes - hanya bisa diakses jika sudah login */}
        <Route 
          path="/Home" 
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route 
          path="/Dashboard" 
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route 
          path="/Report" 
          element={
            <PrivateRoute>
              <Report />
            </PrivateRoute>
          }
        />
        <Route 
          path="/Controller" 
          element={
            <PrivateRoute>
              <Controller />
            </PrivateRoute>
          }
        />
        
        {/* Redirect default route to Login */}
        <Route path="/" element={<Navigate to="/Login" replace />} />
        
        {/* Logout Route - tombol logout */}
        <Route path="/Logout" element={<button onClick={logout}>Logout</button>} />
        
        {/* 404 Route - Page not found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
