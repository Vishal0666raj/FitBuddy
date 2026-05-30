const mongoose = require('mongoose');
const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  muscleGroup: { type: String, default: 'other' },
  defaultSets: { type: Number, default: 3 },
  defaultReps: { type: Number, default: 10 },
  order: { type: Number, default: 0 },
}, { _id: true });

const templateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  type: { type: String, default: 'custom' }, // push, pull, legs, etc.
  color: { type: String, default: '#f97316' },
  exercises: [exerciseSchema],
}, { timestamps: true });

module.exports = mongoose.model('Template', templateSchema);
