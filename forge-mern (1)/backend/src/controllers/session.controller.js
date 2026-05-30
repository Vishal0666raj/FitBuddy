const asyncHandler = require('express-async-handler');
const Session = require('../models/Session');
const Template = require('../models/Template');

exports.list = asyncHandler(async (req, res) => {
  const { from, to, type, completed, q, limit = 200 } = req.query;
  const filter = { user: req.user._id };
  if (from || to) filter.date = {};
  if (from) filter.date.$gte = new Date(from);
  if (to) filter.date.$lte = new Date(to);
  if (type) filter.templateType = type;
  if (completed === 'true') filter.completed = true;
  if (completed === 'false') filter.completed = false;
  if (q) filter.templateName = { $regex: q, $options: 'i' };
  const items = await Session.find(filter).sort('-date').limit(Math.min(+limit, 500));
  res.json(items);
});

exports.getOne = asyncHandler(async (req, res) => {
  const s = await Session.findOne({ _id: req.params.id, user: req.user._id });
  if (!s) { res.status(404); throw new Error('Session not found'); }
  res.json(s);
});

exports.startFromTemplate = asyncHandler(async (req, res) => {
  const { templateId } = req.body;
  const tpl = await Template.findOne({ _id: templateId, user: req.user._id });
  if (!tpl) { res.status(404); throw new Error('Template not found'); }
  const logs = tpl.exercises.map((ex) => ({
    exerciseName: ex.name,
    muscleGroup: ex.muscleGroup,
    sets: Array.from({ length: ex.defaultSets || 3 }, () => ({ reps: ex.defaultReps || 10, weightKg: 0, completed: false })),
  }));
  const s = await Session.create({
    user: req.user._id, template: tpl._id, templateName: tpl.name, templateType: tpl.type, logs,
  });
  res.status(201).json(s);
});

exports.update = asyncHandler(async (req, res) => {
  const s = await Session.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
  if (!s) { res.status(404); throw new Error('Session not found'); }
  res.json(s);
});

exports.remove = asyncHandler(async (req, res) => {
  const r = await Session.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!r) { res.status(404); throw new Error('Session not found'); }
  res.json({ ok: true });
});
