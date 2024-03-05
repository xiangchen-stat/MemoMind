import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import NotesApp from './Components/NotesApp/NotesApp';
import NoteManager from './Components/NoteManager/NoteManager';
import Calendar from './Components/Calendar/Calendar';
import CustomEditor from './Components/NotesApp/CustomEditor';
import './App.css';
import Layout from './Components/Layout/Layout';
import ProtectedRoute from './LoginStore/ProtectedRoute.js'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/Notes" element={
          <ProtectedRoute>
            <Layout><NotesApp /></Layout>
          </ProtectedRoute>} />
        <Route path="/manage-notes" element={
          <ProtectedRoute>
            <Layout><NoteManager /></Layout>
          </ProtectedRoute>} />
        <Route path="/calendar" element={
          <ProtectedRoute>
            <Layout><Calendar /></Layout>
          </ProtectedRoute>} />
          <Route path="/Editor" element={
          <ProtectedRoute>
            <Layout><CustomEditor /></Layout>
          </ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
