const handleSubmit = async (e) => {
  e.preventDefault();
  if (!title || !dueDate) return;

  try {
    await axios.post(API_URL, { 
      // Common title/name variations
      title: title,
      name: title,
      taskName: title,

      // Common date variations
      dueDate: dueDate,
      date: dueDate,
      deadline: dueDate,

      // Additional schema fields seen in your Atlas DB
      courseOrCategory: "General",
      estimatedHours: 1,
      priority: "High",
      status: "Pending"
    });

    setTitle('');
    setDueDate('');
    fetchTasks();
  } catch (err) {
    console.error('Error adding task:', err.response?.data || err.message);
  }
};
