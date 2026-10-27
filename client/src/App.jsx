import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    courseOrCategory: '',
    dueDate: '',
    estimatedHours: 1,
    priority: 'Medium'
  });

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle Form Inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit New Task
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, formData);
      setFormData({
        title: '',
        courseOrCategory: '',
        dueDate: '',
        estimatedHours: 1,
        priority: 'Medium'
      });
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Group tasks by formatted date string
  const groupedTasks = tasks.reduce((acc, task) => {
    const dateStr = new Date(task.dueDate).toISOString().split('T')[0];
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(task);
    return acc;
  }, {});

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', fontFamily: 'sans-serif', padding: '0 20px' }}>
      <h1>Deadline Clash Detector</h1>
      
      {/* Add Task Form */}
      <form onSubmit={handleSubmit} style={{ background: '#f4f4f4', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3>Add New Deadline</h3>
        <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: '1fr 1fr' }}>
          <input
            type="text"
            name="title"
            placeholder="Task Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="courseOrCategory"
            placeholder="Course / Category"
            value={formData.courseOrCategory}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="estimatedHours"
            placeholder="Est. Hours"
            value={formData.estimatedHours}
            onChange={handleChange}
            min="1"
            required
          />
          <select name="priority" value={formData.priority} onChange={handleChange}>
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>
          <button type="submit" style={{ padding: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Add Task
          </button>
        </div>
      </form>

      {/* Grouped Tasks & Clash Detection */}
      <h2>Upcoming Deadlines</h2>
      {Object.keys(groupedTasks).length === 0 ? (
        <p>No deadlines recorded yet.</p>
      ) : (
        Object.keys(groupedTasks).sort().map((date) => {
          const dayTasks = groupedTasks[date];
          const totalHours = dayTasks.reduce((sum, t) => sum + Number(t.estimatedHours), 0);
          const isClash = dayTasks.length >= 2 || totalHours >= 5;

          return (
            <div 
              key={date} 
              style={{ 
                border: isClash ? '2px solid red' : '1px solid #ccc', 
                backgroundColor: isClash ? '#fff0f0' : '#fff', 
                padding: '15px', 
                borderRadius: '8px', 
                marginBottom: '15px' 
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Date: {date}</h3>
                {isClash && (
                  <span style={{ color: 'red', fontWeight: 'bold' }}>
                    ⚠️ CLASH DETECTED ({dayTasks.length} tasks | {totalHours} hrs work)
                  </span>
                )}
              </div>
              <ul style={{ paddingLeft: '20px' }}>
                {dayTasks.map((t) => (
                  <li key={t._id}>
                    <strong>{t.title}</strong> ({t.courseOrCategory}) - {t.estimatedHours} hrs | Priority: <em>{t.priority}</em>
                  </li>
                ))}
              </ul>
            </div>
          );
        })
      )}
    </div>
  );
}

export default App;
