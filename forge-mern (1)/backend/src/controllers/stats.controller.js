const asyncHandler = require('express-async-handler');
const Session = require('../models/Session');

function dayKey(d) { return new Date(d).toISOString().slice(0, 10); }

exports.summary = asyncHandler(async (req, res) => {
  const days = +req.query.days || 120;
  const since = new Date(Date.now() - days * 86400000);
  const sessions = await Session.find({ user: req.user._id, date: { $gte: since } }).sort('date');

  // Heatmap: completed-sessions per day
  const heat = {};
  // Volume per day per template type
  const volumeByDay = {};
  // Totals
  let totalVolume = 0, totalSets = 0, totalReps = 0;
  const typeBreakdown = {};
  const completedDates = new Set();

  for (const s of sessions) {
    const k = dayKey(s.date);
    if (s.completed) completedDates.add(k);
    heat[k] = (heat[k] || 0) + (s.completed ? 1 : 0);
    let vol = 0, sets = 0, reps = 0;
    for (const l of s.logs) for (const set of l.sets) {
      if (!set.completed) continue;
      vol += (set.reps || 0) * (set.weightKg || 0);
      sets += 1; reps += set.reps || 0;
    }
    totalVolume += vol; totalSets += sets; totalReps += reps;
    const type = s.templateType || 'custom';
    typeBreakdown[type] = (typeBreakdown[type] || 0) + vol;
    volumeByDay[k] = volumeByDay[k] || {};
    volumeByDay[k][type] = (volumeByDay[k][type] || 0) + vol;
  }

  // Streak (consecutive days up to today)
  let streak = 0;
  let cursor = new Date();
  while (completedDates.has(dayKey(cursor))) {
    streak += 1;
    cursor = new Date(cursor.getTime() - 86400000);
  }

  res.json({
    days,
    totals: { volume: totalVolume, sets: totalSets, reps: totalReps, sessions: sessions.length },
    streak,
    heat,
    volumeByDay,
    typeBreakdown,
  });
});
