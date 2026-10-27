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
      fetchTasks();
    } catch (err) {
      console.error('Submission failed details:', err.response?.data || err.message);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
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
        <button type="submit" style={{ padding: '5px 10px' }}>Add Task</button>
      </form>

      <h2>Task List</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map((task) => (
          <li key={task._id} style={{ marginBottom: '8px' }}>
            <strong>{task.title}</strong> — {new Date(task.dueDate).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
