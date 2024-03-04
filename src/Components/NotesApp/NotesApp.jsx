import React, { useState, useEffect } from 'react';
import './NotesApp.css';
import { NavLink } from 'react-router-dom';

const NotesApp = () => {
  // State declarations
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [labels, setLabels] = useState([]); // All available labels
  const [selectedLabels, setSelectedLabels] = useState([]); // Labels for the current note
  const [newLabel, setNewLabel] = useState(''); // State for managing new label input
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(`http://localhost:3001/Notes?userEmail=${userEmail}`);
        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error('Error fetching notes:', error);
        setNotes([]);
      }
    };

    fetchNotes();
  }, []);

  const handleCreateLabel = () => {
    if (newLabel && !labels.includes(newLabel)) {
      setLabels([...labels, newLabel]);
      setNewLabel(''); // Clear input field after adding
    }
  };

  const handleLabelCheckChange = (e, label) => {
    if (e.target.checked) {
      setSelectedLabels([...selectedLabels, label]);
    } else {
      setSelectedLabels(selectedLabels.filter((l) => l !== label));
    }
  };
    
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
      userEmail,
      NoteName: title,
      Contents: content,
      Labels: selectedLabels,
    };
    try { /* add labels to backend later ?*/
      const response = await fetch(`http://localhost:3001/Notes?userEmail=${userEmail}`, {
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
      NoteName: title,
      Contents: content,
      Labels: selectedLabels, // Include selected labels here

    }

    try {
      const response = await fetch(`http://localhost:3001/Notes/${selectedNote._id}?userEmail=${userEmail}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedNote),
      });
  
      const savedNote = await response.json();

      const updatedNotesList = notes.map((note) =>
        note._id === selectedNote._id ? savedNote : note 
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
      await fetch(`http://localhost:3001/Notes/${noteId}?userEmail=${userEmail}`, {
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
        <form className="note-form" onSubmit={(event) => selectedNote ? handleUpdateNote(event) : handleAddNote(event)}>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Title"
          required
        ></input>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Content"
          rows={10}
          required
        ></textarea>

          {selectedNote ? (
            <div className="edit-buttons">
              <button type="submit">Save</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          ) : ( <button type="submit">Add Note</button>)}
        </form>
              {/* Displaying notes from Database. */}
              <div className="notes-grid">
                {Array.isArray(notes) && notes.map((note)=> (
                  <div key={note._id} className="note-container">
                    <div 
                      className={`note-item ${selectedNote && selectedNote._id === note._id ? 'note-selected' : ''}`}
                      onClick={()=> handleNoteClick(note)}
                    >
                      {/* Header for deleting Notes. */}
                      <div className="notes-header">
                        <button onClick={(event) => deleteNote(event, note._id)}>x</button>
                      </div>
                      <NavLink to={`/notes/${note._id}`} activeClassName="active-note"></NavLink>
                      {/* Actual display of notes. */}
                      <h2>{note.NoteName}</h2>
                      
                      <p>{note.Contents}</p>
                    </div>
                  </div>
                ))}
              </div>
      </div>
      <div className="labels-sidebar">
        <h3>Labels</h3>
        <input
            type="text"
            placeholder="Create new label"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
          />
          <button type="button" onClick={handleCreateLabel}>Add Label</button>
          {/* Checkboxes for labels */}
          {labels.map((label, index) => (
            <div key={index}>
              <input
                type="checkbox"
                id={`label-${index}`}
                value={label}
                onChange={(e) => handleLabelCheckChange(e, label)}
                checked={selectedLabels.includes(label)}
              />
              <label htmlFor={`label-${index}`}>{label}</label>
            </div>
          ))}
        </div>
    </div>
  )
}

export default NotesApp;