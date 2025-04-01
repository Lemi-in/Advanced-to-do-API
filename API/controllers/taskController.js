const Task = require('../models/Task');
const Collection = require('../models/Collection');

exports.getTasksByCollection = async (req, res) => {
  const collectionId = req.params.id;
  const userId = req.user._id;

  try {
    const collection = await Collection.findOne({ _id: collectionId, user: userId });
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found or not owned by user' });
    }

    const tasks = await Task.find({ collectionId, user: userId });
    res.json({ tasks, collectionName: collection.name });
  } catch (err) {
    console.error('Error in getTasksByCollection:', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

// PATCH /api/tasks/:id/toggle
exports.toggleTaskCompletion = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

    if (!task) return res.status(404).json({ error: 'Task not found or not owned by user' });

    task.completed = !task.completed;
    await task.save();

    res.json({ success: true, task });
  } catch (err) {
    console.error('Toggle error:', err);
    res.status(500).json({ error: 'Failed to toggle task completion' });
  }
};




exports.getTasks = async (req, res) => {
  const tasks = await Task.find({ collectionId: req.params.id, user: req.user.id });

};


exports.createTask = async (req, res) => {
  try {
    const { title, dueDate, priority, reminderDate, collectionId, parent } = req.body;

    const task = new Task({
      title,
      dueDate,
      priority,
      reminderDate,
      collectionId,
      parent: parent || null,
      user: req.user.id, 
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
};



exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, 
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error('❌ Error updating task:', err);
    res.status(500).json({ message: 'Failed to update task' });
  }
};



async function deleteTaskAndChildren(id, userId) {
  const children = await Task.find({ parent: id, user: userId });
  for (const child of children) {
    await deleteTaskAndChildren(child._id, userId);
  }
  await Task.deleteOne({ _id: id, user: userId });
}

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }

    await deleteTaskAndChildren(task._id, task.user);
    res.json({ message: 'Task and subtasks deleted' });
  } catch (err) {
    console.error('❌ Error deleting task and subtasks:', err);
    res.status(500).json({ message: 'Failed to delete task' });
  }
};
