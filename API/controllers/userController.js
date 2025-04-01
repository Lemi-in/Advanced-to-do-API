const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.getProfile = async (req, res) => {
    try {

      const user = await User.findById(req.user.id).select('-password -resetToken -resetTokenExpiry');
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (err) {
      console.error('Error in getProfile:', err);
      res.status(500).json({ error: 'Failed to fetch user profile' });
    }
  };
  


exports.updateProfile = async (req, res) => {
  const { name, theme } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (name !== undefined) user.name = name;
    if (theme === 'light' || theme === 'dark') user.theme = theme;

    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    console.error('Error in updateProfile:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
