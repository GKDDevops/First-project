import React, { useEffect, useState } from 'react';
import axios from 'axios';

const priorityColors = {
  High: "#ff6b6b",
  Medium: "#ffd93d",
  Low: "#6bcB77"
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [remark, setRemark] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editPriority, setEditPriority] = useState('Medium');
  const [editRemark, setEditRemark] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/tasks')
      .then(res => setTasks(res.data))
      .catch(() => setError('Failed to fetch tasks'))
      .finally(() => setLoading(false));
  }, []);

  const addTask = async () => {
    if (!text.trim()) return;
    setAdding(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/tasks', {
        text,
        priority,
        remark
      });
      setTasks([...tasks, res.data]);
      setText('');
      setPriority('Medium');
      setRemark('');
    } catch (err) {
      setError('Failed to add task');
    }
    setAdding(false);
  };

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

  const startEdit = (task) => {
    setEditingId(task._id);
    setEditText(task.text);
    setEditPriority(task.priority || 'Medium');
    setEditRemark(task.remark || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
    setEditPriority('Medium');
    setEditRemark('');
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return;
    setError('');
    try {
      const res = await axios.put(`http://localhost:5000/api/tasks/${id}`, {
        text: editText,
        priority: editPriority,
        remark: editRemark
      });
      setTasks(tasks.map(task =>
        task._id === id ? res.data : task
      ));
      cancelEdit();
    } catch (err) {
      setError('Failed to update task');
    }
  };

  return (
    <div style={{
      maxWidth: 500,
      margin: "40px auto",
      fontFamily: "Segoe UI, Arial, sans-serif",
      background: "#f2f6fc",
      borderRadius: 16,
      padding: 24,
      boxShadow: "0 4px 24px rgba(0,0,0,0.08)"
    }}>
      <h1 style={{
        textAlign: "center",
        color: "#3e64ff",
        letterSpacing: 2,
        marginBottom: 24
      }}>To Do List</h1>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        marginBottom: 16
      }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Enter a new task"
          style={{
            padding: 10, borderRadius: 6, border: "1px solid #b3b3b3",
            fontSize: 16, outline: "none"
          }}
          disabled={adding}
          onKeyDown={e => { if (e.key === 'Enter') addTask(); }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <select
            value={priority}
            onChange={e => setPriority(e.target.value)}
            style={{
              padding: 8, borderRadius: 6, border: "1px solid #b3b3b3",
              background: priorityColors[priority], color: "#222", fontWeight: "bold"
            }}
            disabled={adding}
          >
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
          <input
            value={remark}
            onChange={e => setRemark(e.target.value)}
            placeholder="Remark"
            style={{
              flex: 1, padding: 8, borderRadius: 6, border: "1px solid #b3b3b3",
              fontSize: 16
            }}
            disabled={adding}
          />
          <button
            onClick={addTask}
            style={{
              padding: "8px 16px", borderRadius: 6,
              background: "#3e64ff", color: "#fff", border: "none",
              fontWeight: "bold", cursor: "pointer"
            }}
            disabled={adding || !text.trim()}
          >
            {adding ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
      {error && <div style={{ color: "#e63946", marginBottom: 8 }}>{error}</div>}
      {loading ? (
        <div style={{ textAlign: "center" }}>Loading tasks...</div>
      ) : (
        <ul style={{ padding: 0, listStyle: "none" }}>
          {tasks.length === 0 && <li style={{ color: "#888", textAlign: "center" }}>No tasks yet!</li>}
          {tasks.map(task => (
            <li key={task._id} style={{
              marginBottom: 12,
              background: "#fff",
              borderRadius: 8,
              padding: "12px 16px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              display: "flex",
              alignItems: "center",
              borderLeft: `6px solid ${priorityColors[task.priority || 'Medium']}`
            }}>
              {editingId === task._id ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                  <input
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    style={{
                      padding: 8, borderRadius: 5, border: "1px solid #b3b3b3",
                      fontSize: 15
                    }}
                  />
                  <div style={{ display: "flex", gap: 8 }}>
                    <select
                      value={editPriority}
                      onChange={e => setEditPriority(e.target.value)}
                      style={{
                        padding: 7, borderRadius: 5, border: "1px solid #b3b3b3",
                        background: priorityColors[editPriority], color: "#222", fontWeight: "bold"
                      }}
                    >
                      <option value="High">High Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="Low">Low Priority</option>
                    </select>
                    <input
                      value={editRemark}
                      onChange={e => setEditRemark(e.target.value)}
                      placeholder="Remark"
                      style={{
                        flex: 1, padding: 7, borderRadius: 5, border: "1px solid #b3b3b3",
                        fontSize: 15
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div style={{ flex: 1 }}>
                  <span style={{
                    fontWeight: "bold",
                    color: priorityColors[task.priority || 'Medium'],
                    fontSize: 17
                  }}>{task.text}</span>
                  <span style={{
                    marginLeft: 12,
                    fontSize: 13,
                    color: "#888",
                    fontStyle: "italic"
                  }}>
                    [{task.priority || 'Medium'}]
                  </span>
                  {task.remark && (
                    <span style={{
                      marginLeft: 10,
                      color: "#3e64ff",
                      fontSize: 13,
                      background: "#e8eaf6",
                      borderRadius: 4,
                      padding: "2px 6px"
                    }}>
                      {task.remark}
                    </span>
                  )}
                </div>
              )}
              {editingId === task._id ? (
                <>
                  <button
                    onClick={() => saveEdit(task._id)}
                    style={{
                      marginLeft: 8, padding: "6px 12px", borderRadius: 5,
                      background: "#38b000", color: "#fff", border: "none",
                      fontWeight: "bold", cursor: "pointer"
                    }}
                  >Save</button>
                  <button
                    onClick={cancelEdit}
                    style={{
                      marginLeft: 4, padding: "6px 12px", borderRadius: 5,
                      background: "#e63946", color: "#fff", border: "none",
                      fontWeight: "bold", cursor: "pointer"
                    }}
                  >Cancel</button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEdit(task)}
                    style={{
                      marginLeft: 8, padding: "6px 12px", borderRadius: 5,
                      background: "#ffd93d", color: "#222", border: "none",
                      fontWeight: "bold", cursor: "pointer"
                    }}
                  >Edit</button>
                  <button
                    onClick={() => deleteTask(task._id)}
                    disabled={deletingId === task._id}
                    style={{
                      marginLeft: 4, padding: "6px 12px", borderRadius: 5,
                      background: "#e63946", color: "#fff", border: "none",
                      fontWeight: "bold", cursor: "pointer"
                    }}
                  >{deletingId === task._id ? "Deleting..." : "Delete"}</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
