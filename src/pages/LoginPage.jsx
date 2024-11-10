import React, { useState } from "react";
import { FaPhone } from "react-icons/fa";
import "./LoginComponent.css";
import EmailAuth from "./auth/EmailAuth";
import GoogleAuth from "./auth/GoogleAuth";
import PhoneAuth from "./auth/PhoneAuth";
import ResetPassword from "./auth/ResetPassword";
import TwitterAuth from "./auth/TwitterAuth";

const LoginPage = () => {
  const [error, setError] = useState("");
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  const handlePhoneAuthClick = () => {
    setShowPhoneInput(true);
    setShowResetPassword(false);
  };

  const handleForgotPasswordClick = () => {
    setShowResetPassword(true);
    setShowPhoneInput(false);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-icons">
          <GoogleAuth setError={setError} />
          <TwitterAuth setError={setError} />
          <div className="icon-circle" onClick={handlePhoneAuthClick}>
            <FaPhone className="icon phone" />
          </div>
        </div>
        <h2>Sign In</h2>
        {error && <div className="error-message">{error}</div>}

        {showResetPassword ? (
          <ResetPassword
            setError={setError}
            setShowResetPassword={setShowResetPassword}
          />
        ) : showPhoneInput ? (
          <PhoneAuth
            setError={setError}
            setShowPhoneInput={setShowPhoneInput}
          />
        ) : (
          <EmailAuth setError={setError} />
        )}

        {!showResetPassword && (
          <div className="forgot-password">
            <span
              onClick={handleForgotPasswordClick}
              className="forgot-password-text"
            >
              Reset Password
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
