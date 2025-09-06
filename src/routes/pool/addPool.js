const express = require('express');
const simpleAPIKeyVerifier = require('../../middleware/simpleAPIKeyVerifier');
const router = express.Router();
const db = require('../../services/firebase');
const osuAPIV2 = require('../../services/osuapi');
const osu = require('../../services/osuapi');

// Note to self: return res.xxx vs res.xxx: function keeps running if you do not return.
router.post('/', simpleAPIKeyVerifier, async (req, res) => {
  const data = req.body;
  const validation = validatePoolData(data);

  if (!validation.valid) {
    if (validation.errors) {
      return res.status(400).json({ errors: validation.errors });
    }
    return res.status(400).json({ error: validation.error });
  }

  // Process maps (example: double the values)
  const { name, maps } = data;
  const processedMaps = {};
  Object.entries(maps).forEach(([key, value]) => {
    processedMaps[key] = value;
  });

  try {
    mapData = await pushPoolToDB(data);
    return res.json(mapData);
  } catch (e) {
    return res.status(404).json(e);
  }
});

function validatePoolData(data) {
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return { valid: false, error: 'Request body must be a JSON object' };
  }

  const { name, maps } = data;

  if (typeof name !== 'string') {
    return { valid: false, error: "'name' must be a string" };
  }

  if (typeof maps !== 'object' || maps === null || Array.isArray(maps)) {
    return { valid: false, error: "'maps' must be a JSON object containing \'slot\': beatmapid" };
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
    return { valid: false, errors };
  }

  return { valid: true };
}

async function pushPoolToDB(data) {
const { name, maps } = data;
  const mapDataRef = db.collection('pools')
                    .doc(name)
                    .collection('map_data');
  const beatmapIds = Object.values(maps);
  fullMapData = await osu.getBeatmaps(beatmapIds);
  toPostInDB = filterBeatmapdata(fullMapData);
  // Map slots back to beatmap info
  print(toPostInDB);
  const result = {};
  for (const [slot, id] of Object.entries(maps)) {
    result[slot] = lookup[id];
  }

  console.log(result);
  
  return result
}

function filterBeatmapdata(fullMapData) {
  return fullMapData.beatmaps.map(map => ({
    id: map.id,
    cs: map.cs,
    ar: map.ar,
    bpm: map.bpm,
    length: formatSeconds(map.hit_length),
    max_combo: map.max_combo
  }));
}

function formatSeconds(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}:${remaining.toString().padStart(2, "0")}`;
}

module.exports = router;
