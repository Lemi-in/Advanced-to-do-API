const Collection = require('../models/Collection');
const Task = require('../models/Task');

exports.getCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ user: req.user._id }).lean();

    // Optional: add task stats to each collection
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
    console.log('Incoming createCollection request');
    console.log('req.user:', req.user); // 👈 must not be undefined
    console.log('req.body:', req.body); // 👈 must include name

    const collection = new Collection({
      name: req.body.name,
      user: req.user._id, // ✅ make sure req.user exists and has _id
    });

    await collection.save();
    res.status(201).json(collection);
  } catch (err) {
    console.error('Failed to create collection:', err);
    res.status(500).json({ error: 'Failed to create collection' });
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
