import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://deadline-clash-detector-api.onrender.com/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !dueDate) return;

    const payload = {
      title: title.trim(),
      dueDate: dueDate,
      courseOrCategory: 'General',
      estimatedHours: 1,
      priority: 'High',
      status: 'Pending'
    };

    try {
      await axios.post(API_URL, payload);
      setTitle('');
      setDueDate('');
      await fetchTasks();
    } catch (err) {
      console.error('Submission failed details:', err.response?.data || err.message);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all tasks?')) return;

    try {
      // 1. Try bulk delete endpoint on backend
      await axios.delete(API_URL);
    } catch (err) {
      // 2. Fallback: delete tasks individually if bulk route is unavailable
      await Promise.allSettled(
        tasks.map((task) => axios.delete(`${API_URL}/${task._id}`))
      );
    }

    // Reset local state and reload clean state from DB
    setTasks([]);
    await fetchTasks();
  };

  const getClashingDates = () => {
    const dateCounts = {};
    tasks.forEach((task) => {
      const formattedDate = new Date(task.dueDate).toISOString().split('T')[0];
      dateCounts[formattedDate] = (dateCounts[formattedDate] || 0) + 1;
    });
    return Object.keys(dateCounts).filter((date) => dateCounts[date] > 1);
  };

  const clashingDates = getClashingDates();

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Deadline Clash Detector</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <button type="submit" style={{ padding: '5px 10px', marginRight: '10px' }}>
          Add Task
        </button>

        {tasks.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            style={{
              padding: '5px 10px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Clear All
          </button>
        )}
      </form>

      {/* Warning banner for clashes */}
      {clashingDates.length > 0 && (
        <div style={{
          backgroundColor: '#ffebe9',
          color: '#d9381e',
          border: '1px solid #ffc0cb',
          padding: '10px',
          margin: '0 auto 20px auto',
          maxWidth: '400px',
          borderRadius: '5px'
        }}>
          ⚠️ <strong>Deadline Clash Detected!</strong> You have multiple tasks due on the same date.
        </div>
      )}

      <h2>Task List</h2>
      {tasks.length === 0 ? (
        <p style={{ color: '#666' }}>No tasks added yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.map((task) => {
            const formattedTaskDate = new Date(task.dueDate).toISOString().split('T')[0];
            const isClashing = clashingDates.includes(formattedTaskDate);

            return (
              <li
                key={task._id}
                style={{
                  marginBottom: '8px',
                  color: isClashing ? '#d9381e' : 'inherit',
                  fontWeight: isClashing ? 'bold' : 'normal'
                }}
              >
                {task.title} — {new Date(task.dueDate).toLocaleDateString()}
                {isClashing && <span style={{ marginLeft: '8px', fontSize: '0.9em' }}>(Clash!)</span>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default App;
