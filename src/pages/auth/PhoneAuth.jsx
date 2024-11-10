import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import React, { useState } from "react";
import { FaPhone } from "react-icons/fa";
import { auth } from "../../firebase";

const PhoneAuth = ({ onSuccess, onError }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [error, setError] = useState("");

  const generateRecaptcha = () => {
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {
            // reCAPTCHA solved
          },
          "expired-callback": () => {
            setError("reCAPTCHA expired. Please try again.");
          },
        }
      );
    } catch (err) {
      console.error("reCAPTCHA initialization error:", err);
      setError("Failed to initialize reCAPTCHA. Please try again.");
    }
  };

  const handlePhoneNumberSubmit = async () => {
    try {
      setError("");
      if (!phoneNumber) {
        setError("Please enter a phone number");
        return;
      }

      const formattedPhoneNumber = phoneNumber.startsWith("+")
        ? phoneNumber
        : `+${phoneNumber}`;

      if (!window.recaptchaVerifier) {
        generateRecaptcha();
      }

      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhoneNumber,
        appVerifier
      );

      window.confirmationResult = confirmationResult;
      setVerificationId(confirmationResult.verificationId);
      alert("Verification code sent to your phone!");
    } catch (error) {
      console.error("Phone auth error:", error);
      setError(error.message);
      onError(error.message);
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    }
  };

  const handleVerificationCodeSubmit = async () => {
    try {
      if (!verificationCode) {
        setError("Please enter the verification code");
        return;
      }

      const confirmationResult = window.confirmationResult;
      if (!confirmationResult) {
        setError("Please request a new verification code");
        return;
      }

      const result = await confirmationResult.confirm(verificationCode);
      onSuccess(result);
    } catch (error) {
      console.error("Verification error:", error);
      setError("Invalid verification code. Please try again.");
      onError(error.message);
    }
  };

  return (
    <>
      {!showPhoneInput ? (
        <div className="icon-circle" onClick={() => setShowPhoneInput(true)}>
          <FaPhone className="icon phone" />
        </div>
      ) : (
        <div className="phone-input-container">
          <input
            type="tel"
            placeholder="Phone Number (e.g., +1234567890)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <div id="recaptcha-container"></div>
          <button onClick={handlePhoneNumberSubmit}>Send Code</button>
          {verificationId && (
            <>
              <input
                type="text"
                placeholder="Enter 6-digit verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <button onClick={handleVerificationCodeSubmit}>
                Verify Code
              </button>
            </>
          )}
          <button
            className="BacktoLogin"
            onClick={() => {
              setShowPhoneInput(false);
              setError("");
              if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
              }
            }}
          >
            Back to Login
          </button>
          {error && <div className="error-message">{error}</div>}
        </div>
      )}
    </>
  );
};

export default PhoneAuth;
