const express = require('express');
const jwtTokenVerifier = require('../../middleware/jwtTokenVerifier');
const router = express.Router();


router.post('/', jwtTokenVerifier, (req, res) => {
  const data = req.body;

  // Check top-level object
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return res.status(400).json({ error: 'Request body must be a JSON object' });
  }

  const { name, maps } = data;

  // Validate name
  if (typeof name !== 'string') {
    return res.status(400).json({ error: "'name' must be a string" });
  }

  // Validate maps
  if (typeof maps !== 'object' || maps === null || Array.isArray(maps)) {
    return res.status(400).json({ error: "'maps' must be a JSON object containing \'slot\': beatmapid" });
  }

  const errors = [];
  Object.entries(maps).forEach(([key, value]) => {
    if (typeof key !== 'string') {
      errors.push(`Invalid Slot: '${key}'`);
    }
    if (!Number.isInteger(value)) {
      errors.push(`Invalid beatmap id: '${key}'`);
    }
  });

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  // Process maps (example: double the values)
  const processedMaps = {};
  Object.entries(maps).forEach(([key, value]) => {
    processedMaps[key] = value;
  });

  res.json({ name, processedMaps });

});

module.exports = router;
