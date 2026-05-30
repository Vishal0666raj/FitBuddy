const r = require('express').Router();
const c = require('../controllers/water.controller');
const { protect } = require('../middleware/auth');
r.use(protect);
r.get('/', c.today);
r.post('/', c.add);
r.delete('/:id', c.remove);
module.exports = r;
