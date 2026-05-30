require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();
connectDB();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'forge-api' }));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/profile', require('./routes/profile.routes'));
app.use('/api/templates', require('./routes/template.routes'));
app.use('/api/sessions', require('./routes/session.routes'));
app.use('/api/schedule', require('./routes/schedule.routes'));
app.use('/api/water', require('./routes/water.routes'));
app.use('/api/stats', require('./routes/stats.routes'));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Forge API listening on :${PORT}`));
