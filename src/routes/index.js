const express = require('express');
const router = express.Router();

router.use('/health', require('./health'));
// router.use('/getTournamentStatistics', require ('./getTournamentStatistics'));
router.use('/getLeaderboards', require('./leaderboards'));

module.exports = router;