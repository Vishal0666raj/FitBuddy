const asyncHandler = require('express-async-handler');
const Profile = require('../models/Profile');

exports.getProfile = asyncHandler(async (req, res) => {
  let p = await Profile.findOne({ user: req.user._id });
  if (!p) p = await Profile.create({ user: req.user._id, name: req.user.name });
  res.json(p);
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const allowed = ['name', 'age', 'gender', 'heightCm', 'weightKg', 'dailyWaterGoalMl'];
  const patch = {};
  for (const k of allowed) if (k in req.body) patch[k] = req.body[k];
  const p = await Profile.findOneAndUpdate({ user: req.user._id }, patch, { new: true, upsert: true });
  res.json(p);
});
