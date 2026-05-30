const r = require('express').Router();
const c = require('../controllers/schedule.controller');
const { protect } = require('../middleware/auth');
r.use(protect);
r.get('/', c.list);
r.put('/', c.set);
module.exports = r;
