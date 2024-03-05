const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const app = express();
const session = require('express-session');
app.use(express.json());
app.use(cors());

/*
mongoose.connect("mongodb+srv://admin:abc12345@admin.bzmamr4.mongodb.net/?retryWrites=true&w=majority")
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Could not connect to MongoDB Atlas', err));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server listening on port ${port}`));

app.use('/api/users', userRoutes);
*/
// This is just a placeholder for now, will adjust when usercreation is finished. 
// Uncomment to play with a mock database. 
// Must comment out other connections to make this work. 
// Must change CONNECTION_STRING and DATABASENAME to your own.

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

// login signup page -------------------------------------

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

// Calendar page -----------------------------------------
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


// main page ---------------------------------------------

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
  const { NoteName, Contents, userEmail, Labels} = req.body; 

  try {
    const result = await database.collection('Notes').insertOne({
      userEmail,
      NoteName,//: NoteName,
      Contents,//: Contents
      Labels,
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


// manage notes page ----------------------------------------

// Gets data from the manage-notes page.
app.get("/manage-notes", async (req, res) => {

  try {
    const notesCollection = database.collection("Notes");
    const notes = await notesCollection.find({ userEmail: req.userEmail }).toArray();
    res.status(200).json(notes);
  } catch (err) {
    console.error("Failed to fetch notes:", err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// Puts data in the manage-notes page.
app.put('/manage-notes/:id', async (req, res) => {
  const noteId = req.params.id;
  const { privacy } = req.body;

  try {
    const result = await database.collection('Notes').updateOne(
      { _id: new mongodb.ObjectId(noteId) },
      { $set: { privacy: privacy } }
    );

    if (result.modifiedCount === 1) {
      res.json({ message: 'Note updated successfully' });
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Failed to update note' });
  }
});