const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const app = express();
app.use(express.json());
app.use(cors());


mongoose.connect("mongodb+srv://admin:abc12345@admin.bzmamr4.mongodb.net/?retryWrites=true&w=majority")
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Could not connect to MongoDB Atlas', err));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server listening on port ${port}`));

app.use('/api/users', userRoutes);

/* // This is just a placeholder for now, will adjust when usercreation is finished. 
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

// main page ---------------------------------------------

// Gets data from notes main page
app.get("/Notes", async (req, res) => {
  try {
  const notesCollection = database.collection("Notes");
  const notes = await notesCollection.find({}).toArray();
  res.status(200).json(notes);
  } catch (err) {
    console.error("Failed to fetch notes:", err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
})

app.post('/Notes', async (req, res) => {
  //const noteId = req.params.id;
  const { NoteName, Contents } = req.body;

  try {
    const result = await database.collection('Notes').insertOne({
      NoteName: NoteName,
      Contents: Contents
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

app.put('/Notes/:id', async (req, res) => {
  const noteId = req.params.id;
  const { NoteName, Contents } = req.body;

  try {
    const result = await database.collection('Notes').updateOne(
      { _id: new mongodb.ObjectId(noteId) },
      {         
        $set: {
          NoteName: NoteName,
          Contents: Contents,
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


app.delete('/Notes/:id', async (req, res) => {
  const noteId = req.params.id;
  //const { id, NoteName, Contents } = req.body;

  try {
    const result = await database.collection('Notes').deleteOne(
      { _id: new mongodb.ObjectId(noteId) },
    );

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
    const notes = await notesCollection.find({}).toArray();
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
*/