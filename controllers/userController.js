// Controller/userController.js
const db = require('../models');
const User = db.User;

// Create new user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
const hashedPassword = await bcrypt.hash(password, 10);
const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: 'User created successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

module.exports = { registerUser };