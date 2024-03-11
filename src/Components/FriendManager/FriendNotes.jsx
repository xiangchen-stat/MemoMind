import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const FriendNotes = () => {
  const { friendEmail } = useParams();
  const [ notes, setNotes ] = useState([]);
  const userEmail = localStorage.getItem('userEmail');
  //console.log(friendEmail)

  // Fetch all your friends public notes.
  useEffect(() => {
    const fetchFriendNotes = async () => {
      try {
        const response = await fetch(`http://localhost:3001/FriendNotes?userEmail=${encodeURIComponent(userEmail)}&friendEmail=${encodeURIComponent(friendEmail)}`);
        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error('Error fetching notes:', error);
        setNotes([])
      }
    };
    fetchFriendNotes();

  }, [friendEmail, userEmail]);

  return (
    <div>
      <h1>{friendEmail}'s Public Notes</h1>
      <div className="notes-grid">
        {/* Display Friends' Notes title and contents */}
        {notes.map((note) => (
          <div key={note._id} className="note-container">
            <div className="note-item">
              <h2>{note.NoteName}</h2>
              <p>{note.Contents}</p>
              {/* Labels Section */}
              <div className="note-labels-container">
                {note.Labels && note.Labels.length > 0 ? (
                  note.Labels.map((label, index) => (
                    <span key={index} className="note-label">{label}</span>
                  ))
                ) : ( <p>No labels</p> )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FriendNotes;
