const Collection = require('../models/Collection');
const Task = require('../models/Task');

exports.getCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ user: req.user._id }).lean();

 
    const populated = await Promise.all(
      collections.map(async (col) => {
        const tasks = await Task.find({ collectionId: col._id });
        const completedTasks = tasks.filter(t => t.completed).length;

        return {
          ...col,
          totalTasks: tasks.length,
          completedTasks,
        };
      })
    );

    res.json(populated);
  } catch (err) {
    console.error('Failed to fetch collections:', err);
    res.status(500).json({ error: 'Failed to fetch collections' });
  }
};


exports.createCollection = async (req, res) => {
  try {

    const collection = new Collection({
      name: req.body.name,
      user: req.user._id, 
    });

    await collection.save();
    res.status(201).json(collection);
  } catch (err) {
    console.error('Failed to create collection:', err);
    res.status(500).json({ error: 'Failed to create collection' });
  }
};


exports.updateCollection = async (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ message: 'Collection name is required' });
  }

  try {
    const updated = await Collection.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },  
      { name },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error('❌ Error updating collection:', err);
    res.status(500).json({ message: 'Failed to update collection', error: err.message });
  }
};


exports.deleteCollection = async (req, res) => {
  try {
    const result = await Collection.deleteOne({ _id: req.params.id, user: req.user._id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Collection not found or unauthorized' });
    }

    res.json({ message: 'Collection deleted successfully' });
  } catch (err) {
    console.error('Error deleting collection:', err);
    res.status(500).json({ message: 'Error deleting collection', error: err.message });
  }
};


exports.toggleFavorite = async (req, res) => {
  try {
    const collection = await Collection.findOne({ _id: req.params.id, user: req.userId });
    if (!collection) return res.status(404).json({ message: 'Not found' });

    collection.favorite = !collection.favorite;
    await collection.save();
    res.json(collection);
  } catch (err) {
    res.status(500).json({ message: 'Error updating collection' });
  }
};
