import React, { useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify'; // Pastikan ToastContainer diimport di sini
import 'react-toastify/dist/ReactToastify.css'; // Pastikan Anda mengimpor CSS untuk toast
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase-config";
import { setDoc, doc } from "firebase/firestore";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Icons for password visibility
// import { dropRight } from 'lodash';
import '../../CSS/register.css'
import Logo from "../../images/Log-Full-Color.png"



function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fname, setFname ] = useState("");
    const [lname, setLname ] = useState("");

    const passwordInputRef = useRef(null); // Create ref for password input
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Only for toggling password visibility

    // Toggle password visibility without using state for showPassword
    const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
    if (passwordInputRef.current) {
        passwordInputRef.current.type = isPasswordVisible ? 'password' : 'text'; // Directly change the input type
    }
    };

  // Fungsi untuk handle submit dan menampilkan toast
const handleRegister = async (e) => {
        e.preventDefault();
        try{
            await createUserWithEmailAndPassword(auth, email, password);
            const user = auth.currentUser;
            console.log(user);
            if(user){
                await setDoc(doc(db, "Users", user.uid), {
                    email: user.email,
                    firstName: fname,
                    lastName: lname,
                    photo:""
                });
            }
            console.log("user created successfully");
            toast.success("User created successfully", {
                position: "top-center",
            })
            window.location.href = "/Login";
        } catch (error) {
            console.log(error.message);
            toast.success(error.message, {
                position: "bottom-center",
            })
        }
    };

  return (
    <div className='App'>
      <div className='auth-wrapper'>
        <div className='auth-inner'>
          <form onSubmit={handleRegister}>
            <div className="FloodyLogo">
              <img src={Logo} alt="Logo Floody" className="Logo" />
            </div>
            <h1 style={{color: "black"}}>Sign Up</h1>
            
            <div className="mb-3">
                <label>First Name</label>
                <input
                type="text"
                className="form-control"
                placeholder="First Name"
                id='firstName'
                value={fname}
                onChange={(e) => setFname(e.target.value)}
                required
            />
            </div>
    
            <div className="mb-3">
                <label>Last Name</label>
                <input
                type="text"
                className="form-control"
                placeholder="Last Name"
                id='lastName'
                value={lname}
                onChange={(e) => setLname(e.target.value)}
                required
            />
            </div>

            <div>
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                className='form-control' 
                id="email" 
                placeholder='Enter email' 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} />
            </div>

            {/* Password Input with Show/Hide Feature */}
            <div className="mb-3 password-container">
              <label>Password</label>
              <div className="password-box">
                <input
                  ref={passwordInputRef} // Reference for the password input
                  type={isPasswordVisible ? "text" : "password"} // Toggle password visibility
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

            <div>
              <p className="Login">
                Already have an account? <a href="/Login" className='LoginLink'>Login Here</a>
              </p>
              <div className="buttonSGP">
                <button type="submit" className="btn btn-primary btnSGP">
                  Sign Up
                </button>
              </div>
            </div>

          </form>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default Login;
