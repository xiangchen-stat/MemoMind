import React, { useState, useEffect } from 'react';
import './PrivacyManager.css'

function NoteManager() {
  const [notes, setNotes] = useState([]); 
  const userEmail = localStorage.getItem('userEmail');

  // Gets the data from the database.
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(`http://localhost:3001/PrivacyManager?userEmail=${userEmail}`);
        const data = await response.json();
        setNotes(data);
        //console.log(data);
      } catch (error) {
        console.error('Error fetching notes:', error);
        setNotes([]);
      }
    };

    fetchNotes();
  }, []);

  const handleNotePrivacyChange = (event, index) => {
    const updatedNotes = [...notes];
    updatedNotes[index].NotePrivacy = event.target.value;
    setNotes(updatedNotes);
  };

  const updateAllPrivacy = async () => {
    // Iterate over the `notes` array and send update requests for each note's privacy.
    const updatePromises = notes.map((note) =>
      fetch(`http://localhost:3001/PrivacyManager/${note._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          NotePrivacy: note.NotePrivacy,
        }),
      })
    );

    try {
      await Promise.all(updatePromises);
      alert('All notes updated successfully!');
      window.location.reload();
    } catch (error) {
      console.error('Error updating notes:', error);
    }
  };


  return (
    <div className="custom-select-wrapper"> 
      <div className="custom-select"> 
          {/* Container for the button. */}
          <div className="button-container">
            <button onClick={updateAllPrivacy} className="update-privacy-button">Update Privacy of All Notes</button>
          </div>
        {/* Display for your notes. */}
        <h3>Your Notes:</h3>
        <ul>
          {notes.map((note, index) => (
             <li key={note._id} className="note-item">
                    <h4>{note.NoteName}</h4>
              <select
                value={note.NotePrivacy}
                onChange={(e) => handleNotePrivacyChange(e, index)}
                className="note-privacy-select"
              >
                <option value="Private">Private</option>
                <option value="Public">Public</option>
              </select>
            </li>
          ))}
        </ul>      
      </div>
    </div>
  );
}

export default NoteManager;
