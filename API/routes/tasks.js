const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const taskController = require('../controllers/taskController');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

router.use(auth);
router.get('/collection/:id', authMiddleware, taskController.getTasksByCollection);
router.post('/', authMiddleware, taskController.createTask);
router.patch('/:id/toggle', authMiddleware, taskController.toggleTaskCompletion);
router.patch('/:id', authMiddleware, taskController.updateTask);
router.delete('/:id', authMiddleware, taskController.deleteTask);




module.exports = router;
