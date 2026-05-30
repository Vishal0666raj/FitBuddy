const r = require('express').Router();
const c = require('../controllers/profile.controller');
const { protect } = require('../middleware/auth');
r.use(protect);
r.get('/', c.getProfile);
r.put('/', c.updateProfile);
module.exports = r;
