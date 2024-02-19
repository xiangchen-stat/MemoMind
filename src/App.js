// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Routes instead of Switch
import LoginSignup from './Components/LoginSignup/LoginSignup';
import NotesApp from './NotesApp'; // Adjust the path as necessary
import './App.css';

function App() {
  return (
    <Router>
      <Routes> {/* Use Routes here */}
        <Route path="/" element={<LoginSignup />} exact />
        <Route path="/notes" element={<NotesApp />} />
        <Route path="/manage-notes" element={<NoteManager />} />
      </Routes>
    </Router>
  );
}

export default App;
