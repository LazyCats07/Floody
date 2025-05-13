import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../../firebase-config";
import { toast } from "react-toastify";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import '../../CSS/SIgnInWGoogle.css'
import GoogleIcon from '@mui/icons-material/Google';
import { IconButton } from '@mui/material';

function SignInwithGoogle() {
  const navigate = useNavigate();  // Initialize the useNavigate hook

  const googleLogin = () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;

        if (user) {
          try {
            await setDoc(doc(db, "Users", user.uid), {
              email: user.email,
              firstName: user.displayName,
              photo: user.photoURL,
              lastName: "",
            });

            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(user));

            toast.success("User logged in successfully", { position: "top-center" });

            // Navigate to Home after successful login
            navigate("/Home");  
          } catch (error) {
            toast.error("Error storing user data: " + error.message, {
              position: "bottom-center",
            });
          }
        }
      })
      .catch((error) => {
        if (error.code === "auth/cancelled-popup-request") {
          toast.warn("Popup was closed before completion", {
            position: "bottom-center",
          });
        } else {
          toast.error("Error during login: " + error.message, {
            position: "bottom-center",
          });
        }
      });
  };

  return (
  <div
    style={{ display: "flex", justifyContent: "center", cursor: "pointer" }}
    onClick={googleLogin}
  >
    <IconButton
      sx={{
        marginTop: '10px',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, color 0.3s ease', // Smooth transition for transform, shadow, and color
        '&:hover': {
          transform: 'scale(1.1)',  // Slightly enlarge the icon on hover
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',  // Add a subtle shadow on hover
          color: '#4285F4',  // Change the icon color to Google's blue color on hover
        },
      }}
    >
      <GoogleIcon sx={{ fontSize: 40 }} /> {/* Customize size of Google icon */}
    </IconButton>
  </div>
  );
}

export default SignInwithGoogle;
