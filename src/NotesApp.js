// src/NotesApp.js
import React from 'react';
import './notes.css'; // Assuming notes.css is moved to src or imported correctly

const NotesApp = () => {
  return (
    <>
      <meta charSet="UTF-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
      <button id="addBtn">
        <i className="fas fa-plus"></i> Add Note
      </button>
      <div id="main">
        {/* Note components go here */}
      </div>
    </>
  );
};

export default NotesApp;