import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://deadline-clash-detector-api.onrender.com/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [hasClash, setHasClash] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
      checkClash(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const checkClash = (taskList) => {
    const dates = taskList.map((task) => task.dueDate ? task.dueDate.split('T')[0] : '');
    const duplicates = dates.some((date, idx) => date && dates.indexOf(date) !== idx);
    setHasClash(duplicates);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !dueDate) return;
    try {
      await axios.post(API_URL, { title, dueDate });
      setTitle('');
      setDueDate('');
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Deadline Clash Detector</h1>

      {hasClash && (
        <div style={{ backgroundColor: '#ff4d4d', color: 'white', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>
          ⚠️ CLASH DETECTED: Multiple tasks share the same deadline!
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Task Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: '8px', marginRight: '10px' }}
          required
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={{ padding: '8px', marginRight: '10px' }}
          required
        />
        <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>Add Task</button>
      </form>

      <h2>Task List</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task._id} style={{ marginBottom: '8px' }}>
            <strong>{task.title}</strong> — {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
