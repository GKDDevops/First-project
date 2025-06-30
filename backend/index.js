const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://gkgcpdevops:72JWnbE1qUN8RJJC@cluster0.nykegii.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const Task = mongoose.model('Task', {
  text: String,
  priority: { type: String, default: 'Medium' },
  remark: String
});

app.get('/api/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post('/api/tasks', async (req, res) => {
  const { text, priority, remark } = req.body;
  const task = new Task({ text, priority, remark });
  await task.save();
  res.json(task);
});

app.delete('/api/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

app.put('/api/tasks/:id', async (req, res) => {
  const { text, priority, remark } = req.body;
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { text, priority, remark },
    { new: true }
  );
  res.json(task);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Backend running on port ${PORT}`));

