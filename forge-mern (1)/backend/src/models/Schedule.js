const mongoose = require('mongoose');
const scheduleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  dayOfWeek: { type: Number, min: 0, max: 6, required: true }, // 0=Sun..6=Sat
  template: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
}, { timestamps: true });
scheduleSchema.index({ user: 1, dayOfWeek: 1 }, { unique: true });
module.exports = mongoose.model('Schedule', scheduleSchema);
