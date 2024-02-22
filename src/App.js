import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import NotesApp from './Components/NotesApp/NotesApp';
import NoteManager from './Components/NoteManager/NoteManager';
import Calendar from './Components/Calendar/Calendar';
import './App.css';
import Layout from './Components/Layout/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/notes" element={<Layout><NotesApp /></Layout>} />
        <Route path="/manage-notes" element={<Layout><NoteManager /></Layout>} />
        <Route path="/calendar" element={<Layout><Calendar /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
