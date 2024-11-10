import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

const GoogleAuth = ({ setError }) => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="icon-circle" onClick={handleGoogleSignIn}>
      <img src="google.png" alt="Google" className="custom-icon google-icon" />
    </div>
  );
};

export default GoogleAuth;
