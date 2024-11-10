import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

const EmailAuth = ({ setError }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showMessageClass, setShowMessageClass] = useState("");

  const handleEmailPasswordSignIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage("Error: " + error.message);
      setShowMessageClass("show-again");

      setTimeout(() => {
        setShowMessageClass("");
      }, 100);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      {/* Error message */}
      {errorMessage && (
        <div className={`error-message ${showMessageClass}`}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleEmailPasswordSignIn}>
        <div className="email-container">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span className="password-toggle" onClick={togglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Show/Hide icon */}
          </span>
        </div>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default EmailAuth;
