const asyncHandler = require('express-async-handler');
const Template = require('../models/Template');

exports.list = asyncHandler(async (req, res) => {
  const items = await Template.find({ user: req.user._id }).sort('-updatedAt');
  res.json(items);
});
exports.create = asyncHandler(async (req, res) => {
  const t = await Template.create({ ...req.body, user: req.user._id });
  res.status(201).json(t);
});
exports.update = asyncHandler(async (req, res) => {
  const t = await Template.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
  if (!t) { res.status(404); throw new Error('Template not found'); }
  res.json(t);
});
exports.remove = asyncHandler(async (req, res) => {
  const r = await Template.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!r) { res.status(404); throw new Error('Template not found'); }
  res.json({ ok: true });
});
exports.getOne = asyncHandler(async (req, res) => {
  const t = await Template.findOne({ _id: req.params.id, user: req.user._id });
  if (!t) { res.status(404); throw new Error('Template not found'); }
  res.json(t);
});
