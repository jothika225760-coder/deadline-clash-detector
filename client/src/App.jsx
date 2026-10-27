import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://deadline-clash-detector-api.onrender.com/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      if (Array.isArray(response.data)) {
        setTasks(response.data);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    setLoading(true);

    // Convert date string safely to standard ISO format for backend compatibility
    const formattedDueDate = new Date(dueDate).toISOString();

    const payload = {
      title: title.trim(),
      dueDate: formattedDueDate,
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
      console.error('Submission failed:', err.response?.data || err.message);
      alert('Failed to add task: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all tasks?')) return;

    try {
      await axios.delete(API_URL);
    } catch (err) {
      console.error('Clear all failed:', err);
      // Fallback: delete tasks individually if bulk endpoint fails
      await Promise.allSettled(
        tasks.map((task) => axios.delete(`${API_URL}/${task._id}`))
      );
    }

    setTasks([]);
    await fetchTasks();
  };

  // Safe helper function to parse date strings for UI comparison
  const formatDateString = (dateVal) => {
    if (!dateVal) return '';
    const dateObj = new Date(dateVal);
    if (isNaN(dateObj.getTime())) return '';
    return dateObj.toISOString().split('T')[0];
  };

  // Detect duplicate due dates safely
  const getClashingDates = () => {
    const dateCounts = {};
    tasks.forEach((task) => {
      const formattedDate = formatDateString(task.dueDate);
      if (formattedDate) {
        dateCounts[formattedDate] = (dateCounts[formattedDate] || 0) + 1;
      }
    });
    return Object.keys(dateCounts).filter((date) => dateCounts[date] > 1);
  };

  const clashingDates = getClashingDates();

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Deadline Clash Detector</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ marginRight: '10px', padding: '6px' }}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
          style={{ marginRight: '10px', padding: '6px' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '6px 12px', cursor: 'pointer', marginRight: '10px' }}>
          {loading ? 'Adding...' : 'Add Task'}
        </button>

        {tasks.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            style={{
              padding: '6px 12px',
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
          padding: '12px',
          marginBottom: '20px',
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
            const formattedTaskDate = formatDateString(task.dueDate);
            const isClashing = clashingDates.includes(formattedTaskDate);
            const displayDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date';

            return (
              <li
                key={task._id || Math.random()}
                style={{
                  marginBottom: '10px',
                  padding: '8px',
                  backgroundColor: isClashing ? '#fff0f0' : '#f9f9f9',
                  border: isClashing ? '1px solid #d9381e' : '1px solid #ddd',
                  borderRadius: '4px',
                  color: isClashing ? '#d9381e' : '#333',
                  fontWeight: isClashing ? 'bold' : 'normal'
                }}
              >
                {task.title} — {displayDate}
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