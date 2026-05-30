const asyncHandler = require('express-async-handler');
const Schedule = require('../models/Schedule');

exports.list = asyncHandler(async (req, res) => {
  const items = await Schedule.find({ user: req.user._id }).populate('template');
  res.json(items);
});

exports.set = asyncHandler(async (req, res) => {
  const { dayOfWeek, templateId } = req.body;
  if (templateId == null) {
    await Schedule.findOneAndDelete({ user: req.user._id, dayOfWeek });
    return res.json({ ok: true });
  }
  const s = await Schedule.findOneAndUpdate(
    { user: req.user._id, dayOfWeek },
    { template: templateId },
    { new: true, upsert: true }
  ).populate('template');
  res.json(s);
});
