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
    <div className="flex flex-col space-y-4 max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      {/* Add a dedicated container for reCAPTCHA */}
      <div id="recaptcha-container"></div>

      {!confirmationResult ? (
        <form onSubmit={handlePhoneNumberSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="phone"
              className="label-margin"
              style={{ marginRight: "10px" }}
            >
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="input-margin"
              disabled={loading}
              required
            />
            <p className="mt-2 m text-sm">
              Enter phone number with country code (e.g., +1 for US)
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !phoneNumber}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Verification Code"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerificationCodeSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={loading}
              maxLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || verificationCode.length !== 6}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </form>
      )}

      <button
        onClick={() => setShowPhoneInput(false)}
        className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Back to Sign In
      </button>
    </div>
  );
};

export default PhoneAuth;
