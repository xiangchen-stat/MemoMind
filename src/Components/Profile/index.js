import React, { useState, useEffect } from "react";

function Name() {
    const [userName, setUserName] = useState("");
  
    useEffect(() => {
      // Assuming the server response includes a "user" object with a "name" property
      const userData = JSON.parse(localStorage.getItem("userData")); // Hypothetical storage
      if (userData && userData.user && userData.user.name) {
        setUserName(userData.user.name);
      }
    }, []);
      return (
      <div>
        Welcome, {userName}!
      </div>
    );
  }
  export default Name;

