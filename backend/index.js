const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://gkgcpdevops:72JWnbE1qUN8RJJC@cluster0.nykegii.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0cd')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Simple schema
const Task = mongoose.model('Task', { text: String });

// API endpoints
app.get('/api/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post('/api/tasks', async (req, res) => {
  const task = new Task({ text: req.body.text });
  await task.save();
  res.json(task);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
