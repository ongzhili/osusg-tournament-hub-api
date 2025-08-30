const express = require('express');
const router = express.Router();

// GET /health
router.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

module.exports = router;