const handleSubmit = async (e) => {
  e.preventDefault();
  if (!title || !dueDate) return;

  try {
    await axios.post('https://deadline-clash-detector-api.onrender.com/api/tasks', {
      title: String(title).trim(),
      dueDate: new Date(dueDate).toISOString(),
      courseOrCategory: 'General',
      estimatedHours: Number(1),
      priority: 'High',
      status: 'Pending'
    });

    setTitle('');
    setDueDate('');
    fetchTasks();
  } catch (err) {
    // This prints the exact Mongoose error field in your browser console if it fails
    console.error('Validation Error Details:', err.response?.data);
  }
};
