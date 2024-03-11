import React, {useEffect, useState} from "react";
import './profile.css';


function Profile() {
  const [userName, setUserName] = useState("");  const userEmail = localStorage.getItem("userEmail");
  const profilePictureUrl = "https://i.pinimg.com/736x/1e/94/7d/1e947dfcaad552afa209bceebbfac47b.jpg";
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
        {/* Add more profile information sections here */}
      </div>
    </div>
  );
}

export default Profile;
