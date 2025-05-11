import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../../firebase-config";
import { toast } from "react-toastify";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

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
    <div>
      <p className="continue-p">--Or continue with--</p>
      <div
        style={{ display: "flex", justifyContent: "center", cursor: "pointer" }}
        onClick={googleLogin}
      >
        <img src={require("../../images/google.png")} alt="Google Button" width={"60%"} />
      </div>
    </div>
  );
}

export default SignInwithGoogle;
