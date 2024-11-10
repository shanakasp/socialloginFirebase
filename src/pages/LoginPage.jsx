import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginComponent.css";
import EmailAuth from "./auth/EmailAuth";
import GoogleAuth from "./auth/GoogleAuth";
import PhoneAuth from "./auth/PhoneAuth";
import TwitterAuth from "./auth/TwitterAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleAuthSuccess = (result) => {
    console.log("Authentication successful:", result);
    navigate("/dashboard");
  };

  const handleAuthError = (errorMessage) => {
    setError(errorMessage);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-icons">
          <GoogleAuth onSuccess={handleAuthSuccess} onError={handleAuthError} />
          <TwitterAuth
            onSuccess={handleAuthSuccess}
            onError={handleAuthError}
          />
          <PhoneAuth onSuccess={handleAuthSuccess} onError={handleAuthError} />
        </div>

        <h2>Sign In</h2>

        {error && <div className="error-message">{error}</div>}

        <EmailAuth onSuccess={handleAuthSuccess} onError={handleAuthError} />

        <div className="signup-option">
          <span>Don't have an Account?</span> <a href="/signup">Sign up now</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
