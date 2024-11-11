import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

const PhoneAuth = ({ setError, setShowPhoneInput }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const recaptchaVerifierRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize reCAPTCHA when component mounts
    const initializeRecaptcha = () => {
      try {
        if (!recaptchaVerifierRef.current) {
          recaptchaVerifierRef.current = new RecaptchaVerifier(
            auth,
            "recaptcha-container",
            {
              size: "invisible",
              callback: () => {
                // reCAPTCHA solved
              },
              "expired-callback": () => {
                setError("reCAPTCHA has expired. Please try again.");
                setLoading(false);
              },
            }
          );
        }
      } catch (error) {
        console.error("Error initializing reCAPTCHA:", error);
        setError("Failed to initialize verification system. Please try again.");
      }
    };

    initializeRecaptcha();

    // Cleanup function
    return () => {
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch (error) {
          console.error("Error clearing reCAPTCHA:", error);
        }
        recaptchaVerifierRef.current = null;
      }
    };
  }, [setError]);

  const formatPhoneNumber = (number) => {
    const cleaned = number.replace(/[^\d+]/g, "");
    return cleaned.startsWith("+") ? cleaned : "+" + cleaned;
  };

  const handlePhoneNumberSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumber || !recaptchaVerifierRef.current) return;

    setLoading(true);
    try {
      const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

      // Request OTP using the stored reCAPTCHA verifier
      const confirmation = await signInWithPhoneNumber(
        auth,
        formattedPhoneNumber,
        recaptchaVerifierRef.current
      );

      setConfirmationResult(confirmation);
      setError(null);
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError("Failed to send verification code. Please try again.");

      // Re-initialize reCAPTCHA on error
      if (recaptchaVerifierRef.current) {
        try {
          await recaptchaVerifierRef.current.clear();
        } catch (clearError) {
          console.error("Error clearing reCAPTCHA:", clearError);
        }
        recaptchaVerifierRef.current = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationCodeSubmit = async (e) => {
    e.preventDefault();
    if (!verificationCode || !confirmationResult) return;

    setLoading(true);
    try {
      const result = await confirmationResult.confirm(verificationCode);
      if (result.user) {
        setError(null);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error confirming OTP:", error);
      setError("Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="phone-auth-container">
      {/* Add a dedicated container for reCAPTCHA */}
      <div id="recaptcha-container"></div>

      {!confirmationResult ? (
        <form onSubmit={handlePhoneNumberSubmit} className="phone-auth-form">
          <div className="form-group">
            <label htmlFor="phone" style={{ marginRight: "10px" }}>
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={loading}
              required
            />
            <p>Enter phone number with country code (e.g., +1 for US)</p>
          </div>

          <button type="submit" disabled={loading || !phoneNumber}>
            {loading ? "Sending..." : "Send Verification Code"}
          </button>
        </form>
      ) : (
        <form
          onSubmit={handleVerificationCodeSubmit}
          className="phone-auth-form"
        >
          <div className="form-group">
            <label htmlFor="code" style={{ marginRight: "10px" }}>
              Verification Code
            </label>
            <input
              id="code"
              type="text"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) =>
                setVerificationCode(
                  e.target.value.replace(/\D/g, "").slice(0, 6)
                )
              }
              disabled={loading}
              maxLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || verificationCode.length !== 6}
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </form>
      )}

      <button
        className="back-to-signin-btn"
        onClick={() => setShowPhoneInput(false)}
      >
        Back to Sign In
      </button>
    </div>
  );
};

export default PhoneAuth;
