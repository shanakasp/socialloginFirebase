import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

const PhoneAuth = ({ setError, setShowPhoneInput }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const recaptchaVerifierRef = useRef(null);
  const navigate = useNavigate();

  const handleNetworkError = (error) => {
    console.error("Network Error Details:", error);
    if (error.code === "auth/network-request-failed") {
      setError(
        "Network connection error. Please check your internet connection and try again."
      );
    } else if (error.code === "auth/invalid-verification-code") {
      setError("Invalid verification code. Please try again.");
    } else if (error.code === "auth/invalid-phone-number") {
      setError(
        "Invalid phone number format. Please enter a valid phone number."
      );
    } else if (error.code === "auth/too-many-requests") {
      setError("Too many attempts. Please try again later.");
    } else if (error.code === "auth/captcha-check-failed") {
      setError("reCAPTCHA verification failed. Please try again.");
    } else {
      setError("An error occurred. Please try again later.");
    }
  };

  const initializeRecaptcha = () => {
    try {
      if (!recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "normal",
            callback: (response) => {
              setRecaptchaVerified(true);
              setError(null);
            },
            "expired-callback": () => {
              setError("reCAPTCHA has expired. Please verify again.");
              setRecaptchaVerified(false);
              setLoading(false);
            },
            "error-callback": () => {
              setError(
                "reCAPTCHA error. Please refresh the page and try again."
              );
              setRecaptchaVerified(false);
              setLoading(false);
            },
          }
        );

        // Check if auth is properly initialized
        if (!auth) {
          throw new Error("Firebase Auth is not initialized");
        }

        recaptchaVerifierRef.current.render().catch((error) => {
          console.error("reCAPTCHA render error:", error);
          setError("Error loading reCAPTCHA. Please refresh the page.");
        });
      }
    } catch (error) {
      console.error("Error initializing reCAPTCHA:", error);
      setError(
        "Failed to initialize verification system. Please refresh the page and try again."
      );
    }
  };

  useEffect(() => {
    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initializeRecaptcha();
    }, 1000);

    return () => {
      clearTimeout(timer);
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
    if (!phoneNumber || !recaptchaVerifierRef.current || !recaptchaVerified) {
      setError("Please complete the reCAPTCHA verification.");
      return;
    }

    setLoading(true);
    try {
      // Validate phone number format
      const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
      if (!formattedPhoneNumber.match(/^\+\d{10,15}$/)) {
        throw new Error("Invalid phone number format");
      }

      // Check network connectivity
      if (!navigator.onLine) {
        throw new Error("No internet connection");
      }

      const confirmation = await signInWithPhoneNumber(
        auth,
        formattedPhoneNumber,
        recaptchaVerifierRef.current
      );

      setConfirmationResult(confirmation);
      setError(null);
    } catch (error) {
      console.error("Error sending OTP:", error);
      handleNetworkError(error);

      if (recaptchaVerifierRef.current) {
        try {
          await recaptchaVerifierRef.current.clear();
          recaptchaVerifierRef.current = null;
          setRecaptchaVerified(false);
          initializeRecaptcha();
        } catch (clearError) {
          console.error("Error clearing reCAPTCHA:", clearError);
        }
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
      // Check network connectivity
      if (!navigator.onLine) {
        throw new Error("No internet connection");
      }

      const result = await confirmationResult.confirm(verificationCode);
      if (result.user) {
        setError(null);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error confirming OTP:", error);
      handleNetworkError(error);
    } finally {
      setLoading(false);
    }
  };

  // ... rest of the return JSX remains the same ...
  return (
    <div
      className="phone-auth-container"
      style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}
    >
      {!confirmationResult ? (
        <form onSubmit={handlePhoneNumberSubmit} className="phone-auth-form">
          <div className="form-group" style={{ marginBottom: "20px" }}>
            <label
              htmlFor="phone"
              style={{
                display: "block",
                marginBottom: "10px",
                fontWeight: "500",
              }}
            >
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
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "16px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <p
              style={{
                margin: "5px 0 0",
                fontSize: "14px",
                color: "#666",
              }}
            >
              Enter phone number with country code (e.g., +1 for US)
            </p>
          </div>

          <div
            id="recaptcha-container"
            className="recaptcha-container"
            style={{
              margin: "20px 0",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              transform: "scale(1.2)",
              transformOrigin: "center",
              minHeight: "78px",
            }}
          ></div>

          <button
            type="submit"
            disabled={loading || !phoneNumber || !recaptchaVerified}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              cursor:
                loading || !phoneNumber || !recaptchaVerified
                  ? "not-allowed"
                  : "pointer",
              opacity: loading || !phoneNumber || !recaptchaVerified ? 0.7 : 1,
            }}
          >
            {loading ? "Sending..." : "Send Verification Code"}
          </button>
        </form>
      ) : (
        <form
          onSubmit={handleVerificationCodeSubmit}
          className="phone-auth-form"
        >
          <div className="form-group" style={{ marginBottom: "20px" }}>
            <label
              htmlFor="code"
              style={{
                display: "block",
                marginBottom: "10px",
                fontWeight: "500",
              }}
            >
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
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "16px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading || verificationCode.length !== 6}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              cursor:
                loading || verificationCode.length !== 6
                  ? "not-allowed"
                  : "pointer",
              opacity: loading || verificationCode.length !== 6 ? 0.7 : 1,
            }}
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
