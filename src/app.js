const express = require('express');
const routes = require('./routes');

const app = express();
app.use(express.json());

// Register all routes
app.use('/api/v1/', routes);

// Global error handler (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;