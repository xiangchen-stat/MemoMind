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

/*// Uncomment to play with a mock database. Must comment out other connections AND be connected to cluster0.32qmjxh.mongodb.net somehow to make this work. This is just a placeholder for now, will adjust when usercreation is finished. 
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