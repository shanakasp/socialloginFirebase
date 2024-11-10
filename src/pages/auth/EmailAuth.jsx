import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebase";

const EmailAuth = ({ onSuccess, onError }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailPasswordSignIn = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      onSuccess(result);
    } catch (error) {
      setError(error.message);
      onError(error.message);
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
      onError(error.message);
    }
  };

  return (
    <>
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
        <button type="submit">Sign In</button>
      </form>

      <div className="login-options">
        <a href="#" onClick={handleResetPassword}>
          Reset Password
        </a>
        <a href="/recover-password">Recover Password</a>
      </div>

      {error && <div className="error-message">{error}</div>}
    </>
  );
};

export default EmailAuth;
