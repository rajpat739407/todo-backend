const express = require('express');
const router1 = new express.Router();
const TODOuserTask = require('../model/taskSchema');

// ✅ Create task
router1.post('/tasks', async (req, res) => {
  try {
    const { task, userId } = req.body;

    const newTask = new TODOuserTask({ task, userId });
    await newTask.save();

    res.status(201).json({ message: "Task added successfully", task: newTask });
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ message: "Failed to add task" });
  }
});

// ✅ Get tasks by userId
router1.get("/tasks/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const tasks = await TODOuserTask.find({ userId });
    res.json(tasks);
  } catch (e) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ✅ Update task
router1.patch('/tasks/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const updateData = await TODOuserTask.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    res.status(201).send(updateData);
  } catch (e) {
    res.status(400).send(e);
  }
});

// ✅ Delete task
router1.delete('/tasks/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const deletedTask = await TODOuserTask.findByIdAndDelete(_id);
    res.status(201).send(deletedTask);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router1;
