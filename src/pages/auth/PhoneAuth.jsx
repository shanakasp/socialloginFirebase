import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

const PhoneAuth = ({ setError, setShowPhoneInput }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const navigate = useNavigate();

  const handlePhoneNumberSubmit = async () => {
    try {
      const phoneProvider = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
        },
        auth
      );
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        phoneProvider
      );
      setVerificationId(confirmation.verificationId);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleVerificationCodeSubmit = async () => {
    try {
      const credential = await verificationId.confirm(verificationCode);
      if (credential) {
        navigate("/dashboard");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="phone-input-container">
      <input
        type="tel"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <div id="recaptcha-container"></div>
      <button onClick={handlePhoneNumberSubmit}>Send Code</button>
      {verificationId && (
        <>
          <input
            type="text"
            placeholder="Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
          <button onClick={handleVerificationCodeSubmit}>Verify Code</button>
        </>
      )}

      <button className="back-button" onClick={() => setShowPhoneInput(false)}>
        {" "}
        Back to Sign In
      </button>
    </div>
  );
};

export default PhoneAuth;
