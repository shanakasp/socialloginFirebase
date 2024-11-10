import { TwitterAuthProvider, signInWithPopup } from "firebase/auth";
import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

const TwitterAuth = ({ setError }) => {
  const navigate = useNavigate();

  const handleTwitterSignIn = async () => {
    try {
      const provider = new TwitterAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="icon-circle" onClick={handleTwitterSignIn}>
      {/* Twitter SVG Icon */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 512 512"
        fill="white"
        xmlns="http://www.w3.org/2000/svg"
        className="custom-twitter-icon"
      >
        <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path>
      </svg>
    </div>
  );
};

export default TwitterAuth;
