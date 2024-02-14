import React, { useState } from "react";
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

  const handleSignUp = async () => {
    console.log("Sending signup data:", { name, email, password });

    if (!name || !email || !password) {
      alert("Please fill in all fields for sign up.");
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
        alert("Signup successful!");
      } else {
        alert(data.msg || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Signup error");
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill in all fields for login.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Login successful!");
      } else {
        alert(data.msg || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login error");
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
