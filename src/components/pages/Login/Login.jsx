import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Pastikan Anda mengimpor CSS untuk toast
import '../../CSS/Login.css';  // Pastikan CSS untuk login sudah diimpor
import { signInWithEmailAndPassword } from "firebase/auth";
// import SignInwithGoogle from "./SignInWithGoogle";
import { auth } from "../../firebase-config";




function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Fungsi untuk handle submit dan menampilkan toast
  const handleSubmit = async (e) => { // ⬅️ Perbaikan: Menjadikan fungsi async
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password); // ⬅️ Perbaikan: Tambahkan `await`
      console.log("User logged in successfully");

      //   Pindah Window
      window.location.href = "/Home";
      // |||||||||||||||||||||||||||||||   

      toast.success("User logged in successfully", { position: "top-center" });
    } catch (error) {
      console.error("Login Error:", error.message);
      toast.error(error.message, { position: "bottom-center" });
    }
  };

  return (
    <div className="App">
      <div className="auth-wrapper">
        <div className="auth-inner">
          <form onSubmit={handleSubmit}>
            {/* Menambahkan class Logo pada gambar */}
            <img src={require('../../images/logo.jpg')} alt="Logo Floody" className="Logo" />
            <h1>Login</h1>

            <div>
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                className="form-control" 
                id="email" 
                placeholder="Enter email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                className="form-control" 
                id="password" 
                placeholder="Enter password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary LoginButton">Submit</button>
            </div>
            <p className="forgot-password text-right">
              New user? <a href="/register">Register Here</a>
            </p>
            {/* <SignInwithGoogle /> */}
          </form>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default Login;
