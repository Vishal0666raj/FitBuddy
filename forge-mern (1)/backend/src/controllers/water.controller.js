const asyncHandler = require('express-async-handler');
const Water = require('../models/Water');

function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

exports.today = asyncHandler(async (req, res) => {
  const date = req.query.date || todayKey();
  const entries = await Water.find({ user: req.user._id, date }).sort('createdAt');
  const total = entries.reduce((a, b) => a + b.amountMl, 0);
  res.json({ date, total, entries });
});

exports.add = asyncHandler(async (req, res) => {
  const { amountMl } = req.body;
  const date = req.body.date || todayKey();
  const e = await Water.create({ user: req.user._id, date, amountMl });
  res.status(201).json(e);
});

exports.remove = asyncHandler(async (req, res) => {
  const r = await Water.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!r) { res.status(404); throw new Error('Not found'); }
  res.json({ ok: true });
});
