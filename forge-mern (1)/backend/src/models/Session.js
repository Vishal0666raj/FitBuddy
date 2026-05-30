const mongoose = require('mongoose');
const setSchema = new mongoose.Schema({
  reps: Number,
  weightKg: Number,
  completed: { type: Boolean, default: false },
}, { _id: true });

const logSchema = new mongoose.Schema({
  exerciseName: String,
  muscleGroup: String,
  sets: [setSchema],
}, { _id: true });

const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  template: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
  templateName: String,
  templateType: String,
  date: { type: Date, default: Date.now, index: true },
  durationMin: Number,
  notes: String,
  completed: { type: Boolean, default: false },
  logs: [logSchema],
}, { timestamps: true });

sessionSchema.virtual('totalVolume').get(function () {
  let v = 0;
  for (const l of this.logs) for (const s of l.sets) if (s.completed) v += (s.reps || 0) * (s.weightKg || 0);
  return v;
});
sessionSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Session', sessionSchema);
