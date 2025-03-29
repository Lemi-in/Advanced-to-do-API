const Collection = require('../models/Collection');
const Task = require('../models/Task');

exports.getCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ user: req.userId });

    const tasks = await Task.find({ user: req.userId });

    const collectionsWithStats = collections.map((collection) => {
      const relatedTasks = tasks.filter(t => t.collectionId.toString() === collection._id.toString());
      const total = relatedTasks.length;
      const done = relatedTasks.filter(t => t.completed).length;
      return {
        ...collection.toObject(),
        totalTasks: total,
        completedTasks: done,
      };
    });

    res.json(collectionsWithStats);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching collections' });
  }
};


exports.createCollection = async (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ message: 'Collection name is required' });
  }

  try {
    const newCollection = await Collection.create({
      name,
      user: req.userId,
    });
    res.status(201).json(newCollection);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating collection' });
  }
};

// ✅ Add this to your collection controller
exports.updateCollection = async (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ message: 'Collection name is required' });
  }

  try {
    const updated = await Collection.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },  // ✅ use 'user', not 'userId' if your schema uses 'user'
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
    await Collection.deleteOne({ _id: req.params.id, user: req.userId });
    res.json({ message: 'Collection deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting collection' });
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
