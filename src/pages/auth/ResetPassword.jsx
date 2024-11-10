import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebase";

const ResetPassword = ({ setError, setShowResetPassword }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Please check your inbox.");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="reset-password">
      <h3>Reset Password</h3>
      <form onSubmit={handlePasswordReset}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Email</button>
      </form>
      {message && <div className="success-message">{message}</div>}

      {/* Back Button */}
      <button
        onClick={() => setShowResetPassword(false)}
        className="back-to-signin-btn"
      >
        Back to Sign In
      </button>
    </div>
  );
};

export default ResetPassword;
