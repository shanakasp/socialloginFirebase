import {
  GoogleAuthProvider,
  RecaptchaVerifier,
  TwitterAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import { FaPhone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import "./LoginComponent.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showPhoneInput, setShowPhoneInput] = useState(false);

  useEffect(() => {
    // Set up reCAPTCHA verifier
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "sign-in-button", {
      size: "invisible",
      callback: (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      },
    });
  }, []);

  const handleEmailPasswordSignIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      navigate("/dashboard"); // Navigate to dashboard after successful login
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleTwitterSignIn = async () => {
    try {
      const provider = new TwitterAuthProvider();
      const result = await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    }
  };

  const handlePhoneNumberSubmit = async () => {
    try {
      const phoneProvider = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        phoneProvider
      );
      setVerificationId(confirmation.verificationId);
      setShowPhoneInput(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleVerificationCodeSubmit = async () => {
    try {
      const credential = await signInWithPhoneNumber(
        verificationId,
        verificationCode
      );
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent. Please check your inbox.");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleBackToEmailSignIn = () => {
    setShowPhoneInput(false);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-icons">
          <div className="icon-circle" onClick={handleGoogleSignIn}>
            <img
              src="google.png"
              alt="Google"
              className="custom-icon google-icon"
            />
          </div>
          <div className="icon-circle" onClick={handleTwitterSignIn}>
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
          <div className="icon-circle" onClick={() => setShowPhoneInput(true)}>
            <FaPhone className="icon phone" />
          </div>
        </div>

        <h2>Sign In</h2>

        {error && <div className="error-message">{error}</div>}

        {showPhoneInput ? (
          <div className="phone-input-container">
            <input
              type="tel"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <div id="recaptcha-container"></div>
            <button onClick={handlePhoneNumberSubmit}>Send Code</button>
            <button
              onClick={handleBackToEmailSignIn}
              style={{ marginLeft: "10px" }}
            >
              Back
            </button>
            {verificationId && (
              <>
                <input
                  type="text"
                  placeholder="Verification Code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
                <button onClick={handleVerificationCodeSubmit}>
                  Verify Code
                </button>
              </>
            )}
          </div>
        ) : (
          <form onSubmit={handleEmailPasswordSignIn}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" id="sign-in-button">
              Sign In
            </button>
          </form>
        )}

        <div className="login-options">
          <a href="#" onClick={handleResetPassword}>
            Reset Password
          </a>
          <a href="/recover-password">Recover Password</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
