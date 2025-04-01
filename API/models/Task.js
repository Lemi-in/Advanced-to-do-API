const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection', required: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', default: null },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: null },
  dueDate: { type: Date, default: null },
  reminderDate: { type: Date, default: null }, 
  tags: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
