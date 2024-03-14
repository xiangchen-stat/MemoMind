import React, { useEffect, useState } from "react";
import './profile.css';

/**
 * A React functional component to display a user's profile information.
 * It fetches the user's name from local storage and displays it along with
 * a predefined profile picture and the user's email address. This component
 * is designed to provide a simple profile overview for information purposes.
 * 
 * @author Cindy Ding
 * @component
 * Utilizes React hooks for state management and effect for fetching user data.
 * The profile picture is currently static but could be made dynamic by fetching
 * the URL as part of the user data.
 * @example
 * return (
 *   <Profile />
 * )
 */

function Profile() {
  // State to hold the user's name, initialized to an empty string.
  const [userName, setUserName] = useState("");
  // Retrieve the user's email from local storage.
  const userEmail = localStorage.getItem("userEmail");
  // Static URL for the profile picture.
  const profilePictureUrl = "https://i.pinimg.com/736x/1e/94/7d/1e947dfcaad552afa209bceebbfac47b.jpg";

  // Effect to fetch and set the user's name from local storage on component mount.
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData?.user?.name) {
      setUserName(userData.user.name);
    }
  }, []);

  return (
    <div className="profile-container">
      <img
        src={profilePictureUrl}
        alt="Profile Avatar"
        className="profile-picture"
      />
      <div className="profile-info">
        <p>Welcome, {userName}!</p>
        <p>Your username is: {userEmail}.</p>
        {/* This area can be expanded with more user information. */}
      </div>
    </div>
  );
}

export default Profile;