import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch tasks on mount
  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/tasks')
      .then(res => setTasks(res.data))
      .catch(() => setError('Failed to fetch tasks'))
      .finally(() => setLoading(false));
  }, []);

  // Add a new task
  const addTask = async () => {
    if (!text.trim()) return;
    setAdding(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/tasks', { text });
      setTasks([...tasks, res.data]);
      setText('');
    } catch (err) {
      setError('Failed to add task');
    }
    setAdding(false);
  };

  // Delete a task
  const deleteTask = async (id) => {
    setDeletingId(id);
    setError('');
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      setError('Failed to delete task');
    }
    setDeletingId(null);
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>My 3-Tier To-Do List</h1>
      <div style={{ marginBottom: 16 }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Enter a new task"
          style={{ padding: 8, width: "70%" }}
          onKeyDown={e => { if (e.key === 'Enter') addTask(); }}
          disabled={adding}
        />
        <button
          onClick={addTask}
          style={{ padding: 8, marginLeft: 8 }}
          disabled={adding || !text.trim()}
        >
          {adding ? "Adding..." : "Add Task"}
        </button>
      </div>
      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
      {loading ? (
        <div>Loading tasks...</div>
      ) : (
        <ul style={{ padding: 0, listStyle: "none" }}>
          {tasks.length === 0 && <li>No tasks yet!</li>}
          {tasks.map(task => (
            <li key={task._id} style={{ marginBottom: 8, display: "flex", alignItems: "center" }}>
              <span style={{ flex: 1 }}>{task.text}</span>
              <button
                onClick={() => deleteTask(task._id)}
                disabled={deletingId === task._id}
                style={{ marginLeft: 8, padding: "2px 8px" }}
              >
                {deletingId === task._id ? "Deleting..." : "Delete"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;

