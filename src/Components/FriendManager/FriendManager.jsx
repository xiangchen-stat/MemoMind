import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './FriendManager.css'

/** 
 * Manages and displays friend relationships for the user.
 * It allows the user to send friend requests, accept incoming requests, view current friends,
 * and remove friends or friend requests. It does this by fetching friend data from the server and updates
 * the UI accordingly.
 * 
 * @author Jermaine Xie
 */
function FriendManager() {
  const [searchEmail, setSearchEmail] = useState('');
  const [searchMessage, setSearchMessage] = useState('');
  const [friendRequests, setFriendRequests] = useState({ incoming: [], outgoing: [] });
  const [currentFriends, setCurrentFriends] = useState([]);
  const userEmail = localStorage.getItem('userEmail');

  // Calls the fetching of the data from the database.
  useEffect(() => {    
    fetchRequests();
    fetchFriends();
  }, []);

  // Function to fetch current requests.
  const fetchRequests = async () => {
    try {
    const response = await fetch(`http://localhost:3001/FriendManager?userEmail=${userEmail}`);
    const data = await response.json();
    setFriendRequests({
      incoming: data.incoming || [], 
      outgoing: data.outgoing || []  
    });

    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  //  Function to fetch current friends.
  const fetchFriends = async () => {
    try {
      const response = await fetch(`http://localhost:3001/FriendManager/friends?userEmail=${userEmail}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const friendRequests = await response.json();

      const friends = friendRequests.map(req => {
      return req.senderEmail === userEmail ? req.receiverEmail : req.senderEmail;
    });
  
      setCurrentFriends(friends);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  // Function to search and add other users email.
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/FriendManager/sendRequest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderEmail: userEmail, receiverEmail: searchEmail }),
      });
      const result = await response.json();
      setSearchMessage(result.message);

      if (response.ok) {
        // Add to outgoing friend request in UI.
        setFriendRequests(prevState => ({
            ...prevState,
            outgoing: [...prevState.outgoing, { receiverEmail: searchEmail, status: 'pending' }]
        }));
      }
      if (result.message === "Friend request accepted") {
        setCurrentFriends(prevFriends => [...prevFriends, searchEmail]);
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
      setSearchMessage('Error sending friend request');
    }
  };

  // Function to accept a friend request.
  const acceptFriendRequest = async (request) => {
    try {
      const response = await fetch(`http://localhost:3001/FriendManager/acceptRequest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: request._id,
          senderEmail: request.senderEmail,
          receiverEmail: userEmail,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        // Remove the accepted request from incoming requests in UI.
        setFriendRequests(prevState => ({
            ...prevState,
            incoming: prevState.incoming.filter(req => req._id !== request._id),
        }));

        // Add the sender to the current friends list in UI.
        setCurrentFriends(prevFriends => [...prevFriends, request.senderEmail]);

        } else {
          throw new Error(result.message || "Failed to accept friend request");
        }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  // Function to remove current friend.
  const removeFriend = async (friendEmail) => {
      try {
        const response = await fetch(`http://localhost:3001/FriendManager/removeFriend`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userEmail, friendEmail })
        });
        if (!response.ok) throw new Error('Failed to remove friend');
    
        // Remove friend in current friends list for UI.
        setCurrentFriends(currentFriends.filter(email => email !== friendEmail));
      } catch (error) {
        console.error(error);
      }
    };

  // Function to remove incoming or outgoing requests. 
  const removeRequest = async (otherUserEmail, type) => {
    try {
      const response = await fetch (`http://localhost:3001/FriendManager/manageRequest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail, otherUserEmail })
      });
      if (!response.ok) throw new Error('Failed to remove request');

      // Remove incoming/outcoming friend request in UI.
      setFriendRequests(prevState => {
        const updatedRequests = prevState[type]?.filter(request => request[type === 'outgoing' ? 'receiverEmail' : 'senderEmail'] !== otherUserEmail) ?? [];
        return { ...prevState, [type]: updatedRequests };
      });
    } catch (error) {
        console.error(error);
    }
  };

  return (
    <div className="FriendManager">
      <div className="AddFriends">
        {/* SearchBar to add friends */}
        <h2>Add Friends</h2>
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Enter user's email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
        {searchMessage && <p>{searchMessage}</p>}
      </div>
  
      {/* Current friends column. */}
      <div className="SectionsContainer">
        <div className="Section">
          <h3>Current Friends</h3>
          <ul>
            {currentFriends.map((friendEmail, index) => (
              <li key={index} className="friend-item">
                <Link className="friend-link" to={`/FriendsNotes/${encodeURIComponent(friendEmail)}`}>{friendEmail}</Link>
                <button onClick={() => removeFriend(friendEmail)}>Remove Friend</button>
              </li>
            ))}
          </ul>
        </div>
  
        {/* Incoming friend request column. */}
        <div className="Section">
          <h3>Incoming Friend Requests</h3>
          <ul>
            {friendRequests.incoming?.map((request, index) => (
              <li key={index} className="friend-item">
                {request.senderEmail}
                <button onClick={() => acceptFriendRequest(request)}>Accept</button>
                <button onClick={() => removeRequest(request.senderEmail, 'incoming')}>Remove Request</button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Outgoing friend request column. */}
        <div className="Section">
          <h3>Outgoing Friend Requests</h3>
          <ul>
            {friendRequests.outgoing?.map((request, index) => (
              <li key={index} className="friend-item">
                {request.receiverEmail}
                <button onClick={() => removeRequest(request.receiverEmail, 'outgoing')}>Remove Request</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
  

export default FriendManager;
