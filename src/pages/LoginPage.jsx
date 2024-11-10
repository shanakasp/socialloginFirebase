import React from "react";
import { FaPhone } from "react-icons/fa";
import "./LoginComponent.css";

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-icons">
          <div className="icon-circle">
            <img
              src="google.png"
              alt="Google"
              className="custom-icon google-icon"
            />
          </div>
          <div className="icon-circle">
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
          <div className="icon-circle">
            <FaPhone className="icon phone" />
          </div>
        </div>
        <h2>Sign In</h2>
        <form>
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">Sign In</button>
        </form>
        <div className="login-options">
          <a href="/reset-password">Reset Password</a>
          <a href="/recover-password">Recover Password</a>
        </div>
        <div className="signup-option">
          <span>Don't have an Account?</span> <a href="/signup">Sign up now</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
