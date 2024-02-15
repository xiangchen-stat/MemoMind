import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./LoginSignup.css";

import user_icon from "../Assets/person.png";
import email_icon from "../Assets/email.png";
import password_icon from "../Assets/password.png";
import logo from "../Assets/memomind.png";


const LoginSignup = () => {
  const [action, setAction] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(""); // Added state for error message
  const [successMsg, setSuccessMsg] = useState(""); // Added state for error message

  const navigate = useNavigate(); // Use useNavigate hook here

  const handleSignUp = async () => {
    setErrorMsg(""); // Clear error message
    setSuccessMsg(""); // Clear error message

    console.log("Sending signup data:", { name, email, password });

    if (!name || !email || !password) {
      setErrorMsg("Please fill in all fields for sign up."); // Set error message
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMsg("Signup successful!");
        navigate('/notes'); // Navigate on success
      } else {
        setErrorMsg(data.msg || "Signup failed"); // Set error message
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrorMsg("Signup error"); // Set error message
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg("Please fill in all fields for login."); // Set error message
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMsg("Login successful!");
        navigate('/notes'); // Navigate on success
      } else {
        setErrorMsg(data.msg || "Login failed"); // Set error message
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg("Login error"); // Set error message
    }
  };
  return (
    <div className="container">
      <div className="header">
        <img
          src={logo}
          alt=""
          style={{ maxWidth: "250px", margin: "0 auto" }}
        />
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        {action === "Login" ? null : (
          <div className="input">
            <img src={user_icon} alt="" />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}
        <div className="input">
          <img src={email_icon} alt="" />
          <input
            type="email"
            placeholder="Email Id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input">
          <img src={password_icon} alt="" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      <div className="error-message">
        {errorMsg && <p role="alert">{errorMsg}</p>}
      </div>
      <div className="success-message">
        {successMsg && <p>{successMsg}</p>} {/* Display success message */}
      </div>
      <div className="submit-container">
        {action === "Login" ? (
          <div className="submit" onClick={handleLogin}>
            Login
          </div>
        ) : (
          <div className="submit" onClick={handleSignUp}>
            Sign Up
          </div>
        )}
        <div
          className={action === "Login" ? "submit gray" : "submit"}
          onClick={() => setAction(action === "Login" ? "Sign Up" : "Login")}
        >
          {action === "Login" ? "Sign Up" : "Login"}
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;