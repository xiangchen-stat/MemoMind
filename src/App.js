import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import NotesApp from './Components/NotesApp/NotesApp';
import PrivacyManager from './Components/PrivacyManager/PrivacyManager';
import Calendar from './Components/Calendar/Calendar';
import CustomEditor from './Components/NotesApp/CustomEditor';
import Layout from './Components/Layout/Layout';
import ProtectedRoute from './LoginStore/ProtectedRoute.js'; 
import FriendManager from './Components/FriendManager/FriendManager'
import FriendNotes from './Components/FriendManager/FriendNotes';
import './App.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/Notes" element={
          <ProtectedRoute>
            <Layout><NotesApp /></Layout>
          </ProtectedRoute>} />
        <Route path="/calendar" element={
          <ProtectedRoute>
            <Layout><Calendar /></Layout>
          </ProtectedRoute>} />
        <Route path="/Editor" element={
          <ProtectedRoute>
            <Layout><CustomEditor /></Layout>
          </ProtectedRoute>} />
        <Route path="/PrivacyManager" element={
          <ProtectedRoute>
            <Layout><PrivacyManager /></Layout>
          </ProtectedRoute>} />
        <Route path="/FriendManager" element={
          <ProtectedRoute>
            <Layout><FriendManager /></Layout>
          </ProtectedRoute>} />
        <Route path="/FriendsNotes/:friendEmail" element={
          <ProtectedRoute>
            <Layout><FriendNotes /></Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
