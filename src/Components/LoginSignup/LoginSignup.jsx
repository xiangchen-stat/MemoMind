import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./LoginSignup.css";
import { useEffect } from 'react';
//import { useAuth } from '../../AuthContext.js';
import user_icon from "../Assets/person.png";
import email_icon from "../Assets/email.png";
import password_icon from "../Assets/password.png";
import logo from "../Assets/memomind.png";

import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, logoutSuccess } from '../../LoginStore/authSlice';

/**
 * Povides a user interface for authentication. It allows users to switch between
 * login and signup forms and handle the respective authentication processes. 
 * 
 * @author Sharon Chen
 * @author Albert Le
 * @author Jermaine Xie
 */
const LoginSignup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const [action, setAction] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(""); 
  const [successMsg, setSuccessMsg] = useState(""); 

  useEffect(() => {
    document.body.classList.add('login-body');
    return () => {
      document.body.classList.remove('login-body');
    };
  }, []);

  // Function that handles signup.
  const handleSignUp = async () => {
    setErrorMsg(""); 
    setSuccessMsg(""); 

    console.log("Sending signup data:", { name, email, password });
    if (!name || !email || !password) {
      setErrorMsg("Please fill in all fields for sign up."); 
      return;
    }
    try {
      const response = await fetch("http://localhost:3001/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        setSuccessMsg("Signup successful!");
        navigate('/Notes'); 
      } else {
        setErrorMsg(data.msg || "Signup failed"); 
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrorMsg("Signup error"); 
      console.log("Signup error:");
    }
  };

  
  // Function that handles login.
  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg("Please fill in all fields for login."); 
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('userData', JSON.stringify(data)); 
        localStorage.setItem('userEmail', data.user.email);
        dispatch(loginSuccess(data))
        setSuccessMsg("Login successful!");

        navigate('/Notes'); 
      } else {
        setErrorMsg(data.msg || "Login failed"); 
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsg("Login error"); 
      console.log("Login error:");
    }
  };
  return (
    <div className="container">
      <div className="header">
        <img src={logo} alt="" style={{ maxWidth: "250px", margin: "0 auto" }}/>
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        {action !== "Login" && (
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
            placeholder="Email"
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
            onKeyUp={(e) => {
              if (e.getModifierState('CapsLock')) {
                alert('Caps Lock is on'); 
              }
            }}
          />
        </div>
      </div>
      <div className="error-message">
        {errorMsg && <p role="alert">{errorMsg}</p>}
      </div>
      <div className="success-message">
        {successMsg && <p>{successMsg}</p>}
      </div>
      <div className="submit-container">
        <div
          className={action === "Login" ? "submit" : "submit gray"}
          onClick={action === "Login" ? handleLogin : () => setAction("Login")}
        >
          Login
        </div>
        <div
          className={action === "Sign Up" ? "submit" : "submit gray"}
          onClick={action === "Sign Up" ? handleSignUp : () => setAction("Sign Up")}
        >
          Sign Up
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
