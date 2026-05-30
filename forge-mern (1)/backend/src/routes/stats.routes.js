const r = require('express').Router();
const c = require('../controllers/stats.controller');
const { protect } = require('../middleware/auth');
r.use(protect);
r.get('/summary', c.summary);
module.exports = r;
