import React, { useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';  // Make sure to import toast CSS
import 'react-toastify/dist/ReactToastify.css';  // Ensure Toastify is correctly imported
import '../../CSS/Login.css';  // Ensure path is correct
import { signInWithEmailAndPassword } from "firebase/auth";
import SignInwithGoogle from "./SignInWithGoogle";
import { auth } from "../../firebase-config";
import { FaEye, FaEyeSlash } from "react-icons/fa";  // Icons for password visibility
import { useNavigate } from 'react-router-dom';  // Import useNavigate

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const passwordInputRef = useRef(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();  // Initialize useNavigate

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
    if (passwordInputRef.current) {
      passwordInputRef.current.type = isPasswordVisible ? 'password' : 'text'; // Toggle input type
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);  // Firebase login
      console.log("User logged in successfully");

      // Navigate to Home page
      navigate('/Home');  // Use navigate instead of window.location.href
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
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3 password-container">
              <label>Password</label>
              <div className="password-box">
                <input
                  ref={passwordInputRef}
                  type={isPasswordVisible ? "text" : "password"}
                  className="form-control"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="toggle-password" onClick={togglePasswordVisibility}>
                  {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary LoginButton"><b>Submit</b></button>
            </div>

            <SignInwithGoogle />

            <p className="forgot-password text-right">
              New user? <a href="/register">Register Here</a>
            </p>
          </form>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default Login;
