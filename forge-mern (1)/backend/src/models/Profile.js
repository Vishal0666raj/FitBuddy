const mongoose = require('mongoose');
const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  name: String,
  age: Number,
  gender: String,
  heightCm: Number,
  weightKg: Number,
  dailyWaterGoalMl: { type: Number, default: 2500 },
}, { timestamps: true });
module.exports = mongoose.model('Profile', profileSchema);
