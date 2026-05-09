/* ================================================================
   MANTRA BACKEND — Express Server Entry Point
   ================================================================ */
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Connect DB ────────────────────────────────────────────────
connectDB();

// ── Middleware ────────────────────────────────────────────────
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({ 
  origin: [process.env.CLIENT_URL, 'https://mantra-shopping.netlify.app'].filter(Boolean), 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiter
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: 'Too many requests' }));

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/products',   require('./routes/products'));
app.use('/api/orders',     require('./routes/orders'));
app.use('/api/ai',         require('./routes/ai'));
app.use('/api/rewards',    require('./routes/rewards'));
app.use('/api/membership', require('./routes/membership'));
app.use('/api/seller',     require('./routes/seller'));
app.use('/api/payment',    require('./routes/payment'));

// ── Health check ───────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// ── 404 handler ────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// ── Error handler ──────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => console.log(`🚀 Mantra backend running on http://localhost:${PORT}`));
