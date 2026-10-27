const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET all tasks (matches GET /api/tasks)
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create task (matches POST /api/tasks)
router.post('/', async (req, res) => {
  const task = new Task({
    title: req.body.title,
    dueDate: req.body.dueDate,
    courseOrCategory: req.body.courseOrCategory || 'General',
    estimatedHours: req.body.estimatedHours || 1,
    priority: req.body.priority || 'High',
    status: req.body.status || 'Pending'
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE all tasks (matches DELETE /api/tasks)
router.delete('/', async (req, res) => {
  try {
    await Task.deleteMany({});
    res.status(200).json({ message: 'All tasks deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE single task by ID (matches DELETE /api/tasks/:id)
router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;