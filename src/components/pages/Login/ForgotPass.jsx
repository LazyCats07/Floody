// import React, { useState } from 'react';
// import { ToastContainer, toast } from 'react-toastify'; // Ensure Toastify is correctly imported
// import 'react-toastify/dist/ReactToastify.css'; // Ensure Toastify is correctly imported
// import '../../CSS/Login.css'; // Ensure path is correct
// import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'; // Corrected imports for firebase functions
// import SignInwithGoogle from './SignInWithGoogle';
// import { auth } from '../../firebase-config'; // Ensure Firebase is correctly initialized
// import { useNavigate } from 'react-router-dom'; // Import useNavigate
// import { useEffect } from 'react';


// function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [resetEmail, setResetEmail] = useState(''); // State to store email for password reset
//   const [isResetFormVisible, setIsResetFormVisible] = useState(false); // State to toggle reset form visibility
//   const navigate = useNavigate(); // Initialize useNavigate

//   // Handle login form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Sign in the user using Firebase Authentication
//       await signInWithEmailAndPassword(auth, email, password);
//       console.log('User logged in successfully');

//       // Navigate to Home page
//       navigate('/Home'); // Use navigate instead of window.location.href
//       toast.success('User logged in successfully', { position: 'top-center' });
//     } catch (error) {
//       console.error('Login Error:', error.message);
//       toast.error(error.message, { position: 'bottom-center' });
//     }
//   };

//   // Handle password reset email
//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     try {
//       await sendPasswordResetEmail(auth, resetEmail); // Send reset email through Firebase
//       toast.success('Password reset email sent!', { position: 'top-center' });
//       setIsResetFormVisible(false); // Hide reset form after sending email
//     } catch (error) {
//       toast.error(`Error: ${error.message}`, { position: 'bottom-center' });
//     }
//   };

//   useEffect(() => {
//     document.title = "Floody - Forgot Password";
//   }, []);

//   return (
//     <div className='App'>
//       <div className='auth-wrapper'>
//         <div className='auth-inner'>
//           {/* Login Form */}
//           {!isResetFormVisible && (
//             <form onSubmit={handleSubmit}>
//               <img src={require('../../images/Log-F.jpg')} alt='Logo Floody' className='Logo' />
//               <h1>Login</h1>

//               <div>
//                 <label htmlFor='email'>Email Address</label>
//                 <input
//                   type='email'
//                   className='form-control'
//                   id='email'
//                   placeholder='Enter email'
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)} // Updating email state
//                   required
//                 />
//               </div>

//               <div className='mb-3'>
//                 <label>Password</label>
//                 <input
//                   type='password'
//                   className='form-control'
//                   placeholder='Enter password'
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)} // Updating password state
//                   required
//                 />
//               </div>

//               <div className='d-grid'>
//                 <button type='submit' className='btn btn-primary LoginButton'>
//                   <b>Submit</b>
//                 </button>
//               </div>

//               <SignInwithGoogle />

//               <div>
//                 {/* Link for forgot password */}
//                 <p className='forgot-password text-right'>
//                   Forgot Password?{' '}
//                   <a
//                     href='#'
//                     onClick={() => setIsResetFormVisible(true)}
//                     style={{ color: 'blue', marginLeft: '5px' }}
//                   >
//                     Reset Here
//                   </a>
//                 </p>

//                 <p className='Login'>
//                   Already have an account?{' '}
//                   <a href='/Login' style={{ color: 'blue', marginLeft: '5px' }}>
//                     Login Here
//                   </a>
//                 </p>

//                 <div className='buttonSGP'>
//                   <p className='Login'>
//                     New user?{' '}
//                     <a href='/SignUp' style={{ color: 'blue', marginLeft: '5px' }}>
//                       Register Here
//                     </a>
//                   </p>
//                 </div>
//               </div>
//             </form>
//           )}

//           {/* Forgot Password Form */}
//           {isResetFormVisible && (
//             <form onSubmit={handleResetPassword}>
//               <h1>Reset Password</h1>
//               <div>
//                 <label htmlFor='resetEmail'>Enter your email address</label>
//                 <input
//                   type='email'
//                   className='form-control'
//                   id='resetEmail'
//                   placeholder='Enter email'
//                   value={resetEmail}
//                   onChange={(e) => setResetEmail(e.target.value)} // Updating reset email state
//                   required
//                 />
//               </div>

//               <div className='d-grid'>
//                 <button type='submit' className='btn btn-primary LoginButton'>
//                   <b>Send Reset Link</b>
//                 </button>
//               </div>

//               <p className='Login'>
//                 Back to Login?{' '}
//                 <a
//                   href='#'
//                   onClick={() => setIsResetFormVisible(false)}
//                   style={{ color: 'blue', marginLeft: '5px' }}
//                 >
//                   Login Here
//                 </a>
//               </p>
//             </form>
//           )}

//           <ToastContainer />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;
