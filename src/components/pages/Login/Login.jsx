import React, { useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';  // Ensure Toastify is correctly imported
import 'react-toastify/dist/ReactToastify.css';  // Ensure Toastify is correctly imported
import '../../CSS/Login.css';  // Ensure path is correct
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";  // Corrected imports for firebase functions
import SignInwithGoogle from "./SignInWithGoogle";
import { auth } from "../../firebase-config";  // Ensure Firebase is correctly initialized
import { FaEye, FaEyeSlash } from "react-icons/fa";  // Icons for password visibility
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import Logo from "../../images/Log-Full-Color.png"
import { useEffect } from 'react';
import SignUp from "./Register";


function Login() {
  const [email, setEmail] = useState('');  // State for email
  const [password, setPassword] = useState('');  // State for password
  const [resetEmail, setResetEmail] = useState('');  // State for email used in reset password
  const [isResetFormVisible, setIsResetFormVisible] = useState(false);  // State for controlling reset form visibility
  const passwordInputRef = useRef(null);  // Ref for the password input
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);  // State for password visibility
  const navigate = useNavigate();  // Initialize useNavigate

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
    if (passwordInputRef.current) {
      passwordInputRef.current.type = isPasswordVisible ? 'password' : 'text';  // Toggle input type
    }
  };

  // Handle login form submission
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

  // Handle password reset email submission
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, resetEmail);  // Send reset email through Firebase
      toast.success("Password reset email sent!", { position: "top-center" });
      setIsResetFormVisible(false);  // Hide the reset form after sending email
    } catch (error) {
      toast.error(`Error: ${error.message}`, { position: "bottom-center" });
    }
  };

  useEffect(() => {
    if (isResetFormVisible) {
      document.title = "Floody - Reset Password";
    } else {
      document.title = "Floody - Sign in";  // Atau title default lainnya
    }
  }, [isResetFormVisible]);

  return (
    <div className="App">
      <div className="auth-wrapper">
        <div className="auth-inner">
          {/* Login Form */}
          {!isResetFormVisible && (
            <form onSubmit={handleSubmit}>
              <div className="FloodyLogo">
                <img src={Logo} alt="Logo Floody" className="Logo" />
              </div>
              <h1 style={{color: "black"}}>Sign in</h1>

              <div>
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}  // Updating email state
                  required
                />
              </div>

              <div className="mb-3">
              <span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <span style={{ flex: 1 }}>Password</span>
                  <a
                    href="#"
                    onClick={() => setIsResetFormVisible(true)}
                    style={{
                      textAlign: 'right',
                      opacity: 0.8,
                      color: 'blue',
                      fontWeight: '400',
                      transition: 'color 0.3s ease', // Menambahkan transisi halus untuk perubahan warna
                      fontSize: '12px',
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'darkblue'} // Efek hover dengan perubahan warna
                    onMouseLeave={(e) => e.target.style.color = 'blue'} // Mengembalikan warna setelah hover
                  >
                    Forgot your password?
                  </a>
                </div>
              </span>
                
                <div className="password-box">
                  <input
                    ref={passwordInputRef}
                    type={isPasswordVisible ? "text" : "password"}
                    className="form-control"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}  // Updating password state
                    required
                  />
                  <span className="toggle-password" onClick={togglePasswordVisibility}>
                    {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              <div className="d-grid">
                <button type="submit" className="btn btn-primary LoginButton"><b>Login</b></button>
              </div>

              <SignInwithGoogle />

              <div>
                {/* <p className="Login">
                  Forgot your password?{" "}
                </p> */}
                <div className="buttonSGP" style={{ color: 'blue', marginLeft: '5px', marginTop: '10px'}}>
                  <p className="Login">
                    Don't have an account? {" "}
                    <a href="SignUp" style={{ color: 'blue', marginLeft: '5px'}}>Sign up</a>
                  </p>
                </div>
              </div>
            </form>
          )}

          {/* Forgot Password Form */}
      {isResetFormVisible && (
        <form onSubmit={handleResetPassword}>
          <div className="FloodyLogo">
            <img src={Logo} alt="Logo Floody" className="Logo" />
          </div>
          <h1 style={{color: "black"}}>Reset Password</h1>
          <div>
            <label htmlFor='resetEmail'>Enter your email address</label>
            <input
              type='email'
              className='form-control'
              id='resetEmail'
              placeholder='Enter email'
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />
          </div>

          <div className='d-grid'>
            <button type='submit' className='btn btn-primary LoginButton'>
              <b>Send Reset Link</b>
            </button>
          </div>

          <p className='Login'>
            Back to Login?{" "}
            <a
              href='#'
              onClick={() => setIsResetFormVisible(false)}
              style={{ color: 'blue', marginLeft: '5px' }}
            >
              Login Here
            </a>
          </p>
          <div className="buttonSGP">
            <p className="Login">
              New user?{" "}
              <a href="SignUp" style={{ color: 'blue', marginLeft: '5px' }}>Register Here</a>
            </p>
          </div>
        </form>
      )}

          <ToastContainer />
        </div>
      </div>
    </div>
  );
}

export default Login;
