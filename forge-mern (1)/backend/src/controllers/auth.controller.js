const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Profile = require('../models/Profile');
const signToken = require('../utils/token');

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) { res.status(400); throw new Error('Missing fields'); }
  if (await User.findOne({ email })) { res.status(400); throw new Error('Email already in use'); }
  const user = await User.create({ name, email, password });
  await Profile.create({ user: user._id, name });
  res.status(201).json({ _id: user._id, name: user.name, email: user.email, token: signToken(user._id) });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) { res.status(401); throw new Error('Invalid credentials'); }
  res.json({ _id: user._id, name: user.name, email: user.email, token: signToken(user._id) });
});

exports.me = asyncHandler(async (req, res) => {
  res.json({ _id: req.user._id, name: req.user.name, email: req.user.email });
});
