const handleSubmit = async (e) => {
  e.preventDefault();
  if (!title || !dueDate) return;

  try {
    await axios.post(API_URL, { 
      title, 
      dueDate,
      courseOrCategory: 'General',
      estimatedHours: 1,
      priority: 'High',
      status: 'Pending'
    });
    setTitle('');
    setDueDate('');
    fetchTasks();
  } catch (err) {
    console.error('Error adding task:', err);
  }
};
