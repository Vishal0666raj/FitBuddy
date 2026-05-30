const mongoose = require('mongoose');
const waterSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  amountMl: { type: Number, required: true },
}, { timestamps: true });
waterSchema.index({ user: 1, date: 1 });
module.exports = mongoose.model('Water', waterSchema);
