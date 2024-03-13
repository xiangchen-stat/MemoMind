import React from 'react';
import { useState, useEffect } from 'react';
import './NotesApp.css'; 
import { NavLink } from 'react-router-dom'; // Import Link at the top

/**
 * This page provides an interface for creating, displaying, updating, and deleting notes.
 * It supports note privacy settings, labeling, and searching by note content or labels.
 * 
 * @author Jermaine Xie
 * @author Cindy Ding
 * @author Albert Le
 */
const NotesApp = () => {
  // State declarations
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [privacy, setNotesPrivacy] = useState("Public");
  const [selectedNote, setSelectedNote] = useState(null);
  const [labels, setLabels] = useState([]);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [newLabel, setNewLabel] = useState('');
  const userEmail = localStorage.getItem('userEmail');
  const [searchQuery, setSearchQuery] = useState('');
  const [labelSearchQuery, setLabelSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('content');

useEffect(() => {
  /**  
   * Function to fetch notes for the user from the backend and updates the states.
  */
  const fetchNotes = async () => {
    try {
      const response = await fetch(`http://localhost:3001/Notes?userEmail=${userEmail}`);
      const data = await response.json();
      setNotes(data);
      console.log(data);
      const allLabels = data.reduce((acc, note) => {
        const labels = Array.isArray(note.Labels) ? note.Labels : [];
        return [...acc, ...labels];
      }, []);
      setLabels([...new Set(allLabels)]);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setNotes([]);
    }
  };

  fetchNotes();
}, []);

  /**  
   * Function to create labels and adds it to the list of available ones.
  */
  const handleCreateLabel = () => {
    if (newLabel && !labels.includes(newLabel)) {
      setLabels([...labels, newLabel]);
      setNewLabel(''); 
    }
  };

  /**  
   * Function to toggle selection of a label.
   * @param {Event} e - The change event from the checkbox input.
   * @param {string} label - The label being toggled.
  */
  const handleLabelCheckChange = (e, label) => {
    if (e.target.checked) {
      setSelectedLabels([...selectedLabels, label]);
    } else {
      setSelectedLabels(selectedLabels.filter((l) => l !== label));
    }
  };  

  /**  
   * Function remove labels from the selected labels.
   * @param {string} labelToRemove - The label to remove from the selected labels.
  */
  const handleRemoveLabel = (labelToRemove) => {
    setSelectedLabels(selectedLabels.filter(label => label !== labelToRemove));
  };
  
  /**
   * Function to handle the selection of a note for viewing or editing. 
   * Sets the selected note state and populates textbox.
   * @param {Object} note - The note object being selected.
   */
  const handleNoteClick = (note) => {
  if (selectedNote && selectedNote._id === note._id) {
    setSelectedNote(null);
    setTitle('');
    setContent(''); 
    setSelectedLabels([]);
  } else {
    setSelectedNote(note);
    setTitle(note.NoteName);
    setContent(note.Contents);
    setSelectedLabels(note.Labels || []);
  }
  }
  
  /**
   * Function to handle create new notes. 
   * Creates the note object from state and sends it to the backend.
   * @param {Event} event - The form submission event.
   */
  const handleAddNote = async (event) => {
    event.preventDefault();
    const newNote = {
      userEmail,
      NoteName: title,
      Contents: content,
      Labels: selectedLabels,
      NotePrivacy: privacy,
    };
    try {
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

      console.log(savedNote);
      setNotes([...notes, savedNote]);
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  /**
   * Function to update existing notes.
   * Creates the updated note object from state and sends it to the backend.
   * @param {Event} event - The form submission event.
   */
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

  /**
   * Function to cancel editing a note.
   */
  const handleCancel = () => {
    setTitle("")
    setContent("")
    setSelectedNote(null);
  }

  /**
   * Function to delete a note by its ID and updates the notes list state.
   * @param {Event} event - The click event to stop propagation.
   * @param {string} noteId - The ID of the note to delete.
   */
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
  
  const filteredNotes = notes.filter((note) => {
    const matchesContent = searchQuery.length === 0 || note.Contents.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLabel = labelSearchQuery.length === 0 || (note.Labels && note.Labels.some(label => label.toLowerCase().includes(labelSearchQuery.toLowerCase())));
    
    return matchesContent && matchesLabel;
  });

  return (
    <div className="app-container">
      <div className="notes-section">
        <form className="note-form" onSubmit={(event) => selectedNote ? handleUpdateNote(event) : handleAddNote(event)}>
        <div className="search-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <input
          type="text"
          placeholder="Search notes by content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, marginRight: '10px' }}
        />
        <input
          type="text"
          placeholder="Search notes by label..."
          value={labelSearchQuery}
          onChange={(e) => setLabelSearchQuery(e.target.value)}
          style={{ flex: 1 }}
        />
      </div>

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

        {/* Display Selected Labels as Tags */}
        <div className="selected-labels-container">
          {selectedLabels.map((label, index) => (
            <div key={index} className="selected-label-tag">
              {label}
              <button type="button" onClick={() => handleRemoveLabel(label)}>x</button>
            </div>
          ))}
        </div>
          {selectedNote ? (
            <div className="edit-buttons">
              <button type="submit">Save</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          ) : ( <button type="submit">Add Note</button>)}
        </form>
        <div className="notes-grid">
      {filteredNotes.map((note) => (
        <div key={note._id} className="note-container">
          <div 
            className={`note-item ${selectedNote && selectedNote._id === note._id ? 'note-selected' : ''}`}
            onClick={() => handleNoteClick(note)}
          >
            <div className="notes-header">
              <button onClick={(event) => deleteNote(event, note._id)}>x</button>
            </div>
            <h2>{note.NoteName}</h2>
            <p>{note.Contents}</p>
            {/* Labels Section */}
            <div className="note-labels-container">
              {note.Labels && note.Labels.length > 0 ? (
                note.Labels.map((label, index) => (
                  <span key={index} className="note-label">{label}</span>
                ))
              ) : (
                <p></p>
              )}
            </div>
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
          <div className="create-label-button">
            <button type="button" onClick={handleCreateLabel}>Add Label</button>
          </div>
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
