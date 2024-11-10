import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React from "react";
import { auth } from "../../firebase";

const GoogleAuth = ({ onSuccess, onError }) => {
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      onSuccess(result);
    } catch (error) {
      console.error("Google auth error:", error);
      onError(error.message);
    }
  };

  return (
    <div className="icon-circle" onClick={handleGoogleSignIn}>
      <img src="google.png" alt="Google" className="custom-icon google-icon" />
    </div>
  );
};

export default GoogleAuth;
