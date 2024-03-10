import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import NotesApp from './Components/NotesApp/NotesApp';
import NoteManager from './Components/NoteManager/NoteManager';
import Calendar from './Components/Calendar/Calendar';
import Images from './ImagesApp/index';
import Videos from './VideosApp/index';
import './App.css';
import Layout from './Components/Layout/Layout';
import ProtectedRoute from './LoginStore/ProtectedRoute.js'; 

function App() {
  return (
    <Router>
      <div className="app-container"> {}
        <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route path="/notes" element={
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
          <Route path="/images" element={
            <ProtectedRoute>
              <Layout><Images /></Layout>
            </ProtectedRoute>} />
            <Route path="/videos" element={
            <ProtectedRoute>
              <Layout><Videos/></Layout>
            </ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
