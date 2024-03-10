const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const app = express();
const session = require('express-session');
app.use(express.json());
app.use(cors());

// Database connection -----------------------------------

var Mongoclient = require("mongodb").MongoClient;
require('dotenv').config();

const mongodb = require('mongodb');
var CONNECTION_STRING = "mongodb+srv://jjjermaine:906128149@cluster0.32qmjxh.mongodb.net";

var DATABASENAME = "NotesData";
var database;

Mongoclient.connect(CONNECTION_STRING).then(client => {
  database = client.db(DATABASENAME);
  console.log("Connection successful to MongoDB");
  app.listen(process.env.PORT || 3001, () => {
      console.log(`Server is running on port ${process.env.PORT || 3001}`);
  });
}).catch(error => {
  console.error("Connection error to MongoDB:", error);
});

// login signup page --------------------------------------------------------

// Configure session middleware
app.use(session({
  secret: 'your_secret_key', // Random key for signing the session ID cookie
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Compare the provided password with the one stored in the database.
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await database.collection('Users').findOne({ email: email });
    if (user) {
      if (user.password === password) {
        req.session.userEmail = user.email;
        res.status(200).json({ message: "Login successful", user: { name: user.name, email: user.email }});//, token }); 

      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "An error occurred during login" });
  }
});

// Put the signup data into the database.
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await database.collection('Users').findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Maybe hash the password before storing it?
    const result = await database.collection('Users').insertOne({ name, email, password });

    if (result.acknowledged) {
      const savedUser = await database.collection('Users').findOne({ email: email });
      res.status(201).json({ name: savedUser.name, email: savedUser.email }); 
      
    } else {
      res.status(400).json({ message: 'Failed to add user' });
    }
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Failed to add user' });
  }
});

// Calendar page ------------------------------------------------------

app.post('/api/events', async (req, res) => {
  const { title, start, userEmail } = req.body;

  try {
    const result = await database.collection('Events').insertOne({
      userEmail,
      title,
      start,
    });

    if (result.acknowledged) {
      const savedEvent = await database.collection('Events').findOne({ _id: result.insertedId });
      res.status(201).json(savedEvent); // Return the newly created event
    } else {
      res.status(400).json({ message: 'Failed to add event' });
    }
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({ error: 'Failed to add event' });
  }
});

app.get("/api/events", async (req, res) => {
  const userEmail = req.query.userEmail;

  try {
    const events = await database.collection("Events").find({ userEmail }).toArray();
    res.status(200).json(events);
  } catch (err) {
    console.error("Failed to fetch events:", err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  const { id } = req.params;
  // Optional: You might also want to verify userEmail for ownership before deletion
  const { userEmail } = req.query;

  try {
    const result = await database.collection('Events').deleteOne({
      _id: new mongodb.ObjectId(id), // Convert string ID to MongoDB ObjectId
      userEmail, // Optionally use this to ensure the user owns the event
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});


// main page --------------------------------------------------------

// Gets data from notes main page.
app.get("/Notes", async (req, res) => {
  const userEmail = req.query.userEmail;
  try {
  const notesCollection = database.collection("Notes");
  const notes = await notesCollection.find({ userEmail }).toArray();
  res.status(200).json(notes);
  } catch (err) {
    console.error("Failed to fetch notes:", err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
})

// Allows you to insert notes to the database.
app.post('/Notes', async (req, res) => {
  const { NoteName, Contents, userEmail, Labels, NotePrivacy } = req.body; 

  try {
    const result = await database.collection('Notes').insertOne({
      userEmail,
      NoteName,//: NoteName,
      Contents,//: Contents
      Labels,
      NotePrivacy,
    });

    if (result.acknowledged) {
      const savedNote = await database.collection('Notes').findOne({ _id: result.insertedId });
      res.status(201).json(savedNote); // return the newly created note
      
    } else {
      res.status(400).json({ message: 'Failed to add note' });
    }
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ error: 'Failed to add note' });
  }
});

// Allows you to update the notes in the database. 
app.put('/Notes/:id', async (req, res) => {
  const noteId = req.params.id;
  const { NoteName, Contents, Labels } = req.body;

  try {
    const result = await database.collection('Notes').updateOne(
      { _id: new mongodb.ObjectId(noteId),  },
      {         
        $set: {
          NoteName: NoteName,
          Contents: Contents,
          Labels,
        } 
      }
    );

    if (result.modifiedCount === 1) {
      const updatedNote = await database.collection('Notes').findOne({ _id: new mongodb.ObjectId(noteId) });
      res.json(updatedNote); // send the updated note back
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// Allows you to delete notes from the database.
app.delete('/Notes/:id', async (req, res) => {
  const noteId = req.params.id;
  const userEmail = req.query.userEmail;

  try {
    const result = await database.collection('Notes').deleteOne({ 
        _id: new mongodb.ObjectId(noteId), 
        userEmail: userEmail 
      },);

    if (result.modifiedCount === 1) {
      res.json({ message: 'Note deleted successfully' });
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// Privacy manager page --------------------------------------------

// Gets data for the Privacy manager page.
app.get("/PrivacyManager", async (req, res) => {
  const userEmail = req.query.userEmail;
  try {
    const notesCollection = database.collection("Notes");
    const notes = await notesCollection.find({ userEmail }).toArray();
    res.status(200).json(notes);
  } catch (err) {
    console.error("Failed to fetch notes:", err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// Puts data in the manage-notes page.
app.put('/PrivacyManager/:id', async (req, res) => {
  const noteId = req.params.id;
  const { NotePrivacy } = req.body;

  try {
    const result = await database.collection('Notes').updateOne(
      { _id: new mongodb.ObjectId(noteId) },
      { $set: { NotePrivacy: NotePrivacy } }
    );

    if (result.modifiedCount === 1) {
      res.json({ message: 'Note privacy updated successfully' });
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    console.error('Error updating privacy:', error);
    res.status(500).json({ error: 'Failed to update privacy' });
  }
});

// Friend manager page --------------------------------------------

// Send friend request.
app.post('/FriendManager/sendRequest', async (req, res) => {
  const { senderEmail, receiverEmail } = req.body;

  try {
    // Edge case: Prevents from sending request to yourself.
    if (senderEmail == receiverEmail) {
      return res.status(400).json({ message: "Cannot send a friend request to yourself" });
    }

    // Edge case: Check if user exists.
    const receiverExists = await database.collection("Users").findOne({ email: receiverEmail });
    if (!receiverExists) {
      return res.status(404).json({ message: "User does not exist" });
    }

    // Edge case: Automatically accepts a reciprocal friend request.
    // (1) Check for existing request between two users.
    const existingRequest = await database.collection("Requests").findOne({
      
      $or: [
        { senderEmail: senderEmail, receiverEmail: receiverEmail },
        { senderEmail: receiverEmail, receiverEmail: senderEmail }
      ]
    });

    // (2) If an existing pending request from receiver to sender is found, accept it.
    if (existingRequest && existingRequest.senderEmail === receiverEmail && existingRequest.status === 'pending') {
      await database.collection("Requests").updateOne(
        { _id: existingRequest._id },
        { $set: { status: 'accepted' } }
      );
      return res.status(200).json({ message: "Friend request accepted" });
    }

    // Edge case: Prevents sending multiple requests to the same person.
    if (existingRequest && existingRequest.senderEmail === senderEmail) {
      return res.status(409).json({ message: "Friend request already sent" });
    }

    // Edge case: prevents sending request if already in friends list
    const isAlreadyFriends = await database.collection("Requests").findOne({
      $or: [
        { senderEmail: senderEmail, receiverEmail: receiverEmail, status: 'accepted' },
        { senderEmail: receiverEmail, receiverEmail: senderEmail, status: 'accepted' }
      ]
    });
    if (isAlreadyFriends) {
      return res.status(409).json({ message: "You are already friends with this user" });
    }

    // If edge cases passed, create a new friend request.
    await database.collection("Requests").insertOne({
      senderEmail,
      receiverEmail,
      status: 'pending',
      createdAt: new Date(),
    });

    res.status(200).json({ message: "Friend request sent" });
  } catch (error) {
    console.error('Error processing friend request:', error);
    res.status(500).json({ error: 'Failed to process friend request' });
  }
});


// If the status between friend request is "accepted", then display them as friends.
app.get("/FriendManager/friends", async (req, res) => {
  const userEmail = req.query.userEmail;

  try {
    const requestsCollection = database.collection("Requests");
    const friendsRequests = await requestsCollection.find({
      $or: [{ senderEmail: userEmail }, { receiverEmail: userEmail }],
      status: "accepted"
    }).toArray();

    res.status(200).json(friendsRequests);
  } catch (err) {
    console.error("Failed to fetch friends:", err);
    res.status(500).json({ error: "Failed to fetch friends" });
  }
});

// Gets the user's incoming/outgoing requests
app.get("/FriendManager", async (req, res) => {
  const userEmail = req.query.userEmail;

  try {
    const outgoingRequests = await database.collection("Requests").find({ senderEmail: userEmail, status: 'pending' }).toArray();
    const incomingRequests = await database.collection("Requests").find({ receiverEmail: userEmail, status: 'pending' }).toArray();
    res.status(200).json({ incoming: incomingRequests, outgoing: outgoingRequests });
  } catch (err) {
    console.error("Failed to fetch requests:", err);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

// Marks the request as accepted.
app.post('/FriendManager/acceptRequest', async (req, res) => {
  const { requestId, senderEmail, receiverEmail } = req.body;

  try {
    const updateResult  = await database.collection("Requests").updateOne(
      { _id: new mongodb.ObjectId(requestId), senderEmail, receiverEmail },
      { $set: { status: 'accepted' } },
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({ error: 'Failed to accept friend request' });
  }
});


// Remove a friend from current friends list.
app.post('/FriendManager/removeFriend', async (req, res) => {
  const { userEmail, friendEmail } = req.body;

  try {
    await database.collection("Requests").deleteOne({
      $or: [
        { senderEmail: userEmail, receiverEmail: friendEmail, status: 'accepted' },
        { senderEmail: friendEmail, receiverEmail: userEmail, status: 'accepted' }
      ]
    });
    res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    console.error('Error removing friend:', error);
    res.status(500).json({ error: 'Failed to remove friend' });
  }
});

// Cancel incoming/outcoming friend request.
app.post('/FriendManager/manageRequest', async (req, res) => {
  const { userEmail, otherUserEmail } = req.body; 

  try {
    await database.collection("Requests").deleteOne({
      $or: [
      { senderEmail: userEmail, receiverEmail: otherUserEmail, status: 'pending' },
      { senderEmail: otherUserEmail, receiverEmail: userEmail, status: 'pending' }
      ]
    });

    res.status(200).json({ message: `Request removed successfully` });
  } catch (error) {
    console.error(`Error removing friend request:`, error);
    res.status(500).json({ error: `Failed to remove friend request` });
  }
});

// Friends Notes Page ---------------------------------------------------------

// Get friends public notes.
app.get('/FriendNotes', async (req, res) => {
  const { userEmail, friendEmail } = req.query; 

  try {
    const isFriends = await database.collection("Requests").findOne({
      $or: [
      { senderEmail: userEmail, receiverEmail: friendEmail, status: 'accepted' },
      { senderEmail: friendEmail, receiverEmail: userEmail, status: 'accepted' }
      ]
    });
    //console.log("Is friends?", !!isFriends);

    if (!isFriends) { 
      return res.status(403).json({ message: "Users are not friends" });
    }

    const notes = await database.collection("Notes").find({ userEmail: friendEmail, NotePrivacy: "Public" }).toArray();
    //console.log("Notes found:", notes); 
    //console.log(friendEmail)

    res.status(200).json(notes);
  } catch (error) {
    console.error('Error fetching friend\'s notes:', error);
    res.status(500).json({ error: 'Failed to fetch friend\'s notes' });
  }
});