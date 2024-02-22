import React from 'react';
import { useState, useEffect } from 'react';
import './NotesApp.css'; 
import { Link } from 'react-router-dom'; // Import Link at the top

const NotesApp = () => {
  // All the states of configuring Notes.
  const [ notes, setNotes ] = useState([]);
  const [ title, setTitle ] = useState('');
  const [ content, setContent ] = useState('');
  const [ selectedNote, setSelectedNote ] = useState(null);

  // Function to display notes.
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch('http://localhost:3001/Notes');
        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };

    fetchNotes();
  }, []);

  // Function to click notes.
  const handleNoteClick = (note) => {
  if (selectedNote && selectedNote._id === note._id) {
    setSelectedNote(null);
    setTitle('');
    setContent(''); 
  } else {
    setSelectedNote(note);
    setTitle(note.NoteName);
    setContent(note.Contents);
  }
  }
  
  // Function to add notes.
  const handleAddNote = async (event) => {
    event.preventDefault();

    const newNote = {
      //id: Date.now(),
      NoteName: title,
      Contents: content
    };
    try {
      const response = await fetch('http://localhost:3001/Notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNote),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const savedNote = await response.json();
      setNotes([...notes, savedNote]); 
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  // Function to update the notes.
  const handleUpdateNote = async (event) => {
    event.preventDefault();
    if (!selectedNote) {
      return;
    }

    const updatedNote = {
      //id: selectedNote.id,
      NoteName: title,
      Contents: content,
    }

    try {
      const response = await fetch(`http://localhost:3001/Notes/${selectedNote._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedNote),
      });
  
      const savedNote = await response.json();

      const updatedNotesList = notes.map((note) =>
        note._id === selectedNote._id ? savedNote : note // Assuming your backend returns the updated note
      );
      setNotes(updatedNotesList);
      setTitle('');
      setContent('');
      setSelectedNote(null);
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  // Function to cancel editing a note.
  const handleCancel = () => {
    setTitle("")
    setContent("")
    setSelectedNote(null);
  }

  // Function to delete a note.
  const deleteNote = async (event, noteId) => {
    event.stopPropagation();

    try {
      await fetch(`http://localhost:3001/Notes/${noteId}`, {
        method: 'DELETE',
      });
  
      const updatedNotes = notes.filter((note) => note._id !== noteId);
      setNotes(updatedNotes);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };
  

  return (
    <div className="app-container">
      <div className="notes-section">
        {/* Selecting Note. */}
        <form 
              className="note-form" 
              onSubmit = {(event)=>selectedNote ? handleUpdateNote(event) : handleAddNote(event)}
              >
                {/* Title input display. */}
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Title"
                  required
                ></input>
                {/* Content input display. */}
                <textarea
                  value={content}
                  onChange={(event)=>
                    setContent(event.target.value)}
                  placeholder="Content"
                  rows={10}
                  requred
                ></textarea>
                  {/* Conditional rendering for button for Saving and Adding notes. */}
                  {selectedNote ? (
                    <div className="edit-buttons">
                      <button type="submit">Save</button>
                      <button onClick={handleCancel}>Cancel</button>
                    </div>
                  ) : ( <button type="submit">Add Note</button>)}
              </form>
              {/* Displaying notes from Database. */}
              <div className="notes-grid">
                {notes.map((note)=> (
                  <div key={note._id} className="note-container">
                    <div 
                      className={`note-item ${selectedNote && selectedNote._id === note._id ? 'note-selected' : ''}`}
                      onClick={()=> handleNoteClick(note)}
                    >
                      {/* Header for deleting Notes. */}
                      <div className="notes-header">
                        <button onClick={(event) => deleteNote(event, note._id)}>x</button>
                      </div>
                      {/* Actual display of notes. */}
                      <h2>{note.NoteName}</h2>
                      <p>{note.Contents}</p>
                    </div>
                  </div>
                ))}
              </div>
      </div>
    </div>
  )
}

export default NotesApp;