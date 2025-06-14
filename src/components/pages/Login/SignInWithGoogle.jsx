import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../../firebase-config";
import { toast } from "react-toastify";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../../CSS/SIgnInWGoogle.css";
import GoogleIcon from "@mui/icons-material/Google";
import { IconButton } from "@mui/material";
import { useEffect } from "react";

function SignInwithGoogle() {
  // Set Document Title on component mount
  useEffect(() => {
    document.title = "Floody - Login";
  }, []);

  // Initialize navigation hook
  const navigate = useNavigate();

  // googleLogin - Melakukan login menggunakan Google dan Firebase Authentication
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

            // Simpan data user di localStorage
            localStorage.setItem("user", JSON.stringify(user));

            toast.success("User logged in successfully", { position: "top-center" });

            // Navigasi ke halaman Home setelah login berhasil
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

  // Render - Menampilkan tombol login Google
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        cursor: "pointer",
      }}
      onClick={googleLogin}
    >
      <IconButton
        sx={{
          marginTop: "10px",
          transition: "transform 0.3s ease, box-shadow 0.3s ease, color 0.3s ease",
          "&:hover": {
            transform: "scale(1.1)",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            color: "#4285F4",
          },
        }}
      >
        <GoogleIcon sx={{ fontSize: 40 }} />
      </IconButton>
    </div>
  );
}

export default SignInwithGoogle;
