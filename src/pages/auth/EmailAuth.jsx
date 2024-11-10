import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons for show/hide password
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

const EmailAuth = ({ setError }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to control password visibility

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
      setError(error.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
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
  );
};

export default EmailAuth;
