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