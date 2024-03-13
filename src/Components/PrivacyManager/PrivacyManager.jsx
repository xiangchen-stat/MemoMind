import React, { useState, useEffect } from 'react';
import './PrivacyManager.css'

/**
 * This page allows users to manage the privacy settings of their notes.
 * It fetches all the user's notes from the backend and provides an interface to update each note's privacy setting simultaneously.
 * 
 * @author Jermaine Xie 
 */
function PrivacyManager() {
  const [notes, setNotes] = useState([]); 
  const userEmail = localStorage.getItem('userEmail');

  /**
   * Fetches the user's notes from the backend and updates the notes state.
   */
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

  /**
   * Handles changes to a note's privacy setting by updating the notes in the notes state.
   * @param {Event} event - The change event from the privacy select input.
   * @param {number} index - The index of the note in the notes array whose privacy is being changed.
   */
  const handleNotePrivacyChange = (event, index) => {
    const updatedNotes = [...notes];
    updatedNotes[index].NotePrivacy = event.target.value;
    setNotes(updatedNotes);
  };

  /**
   * Updates the privacy setting of all notes in the backend based on their current states.
   */
  const updateAllPrivacy = async () => {
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
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
            </li>
          ))}
        </ul>      
      </div>
    </div>
  );
}

export default PrivacyManager;
