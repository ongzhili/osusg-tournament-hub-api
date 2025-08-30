const express = require('express');
const router = express.Router();

router.use('/health', require('./health'));
// router.use('/getTournamentStatistics', require ('./getTournamentStatistics'));
router.use('/getLeaderboards', require('./user/leaderboards'));
router.use('/addPool', require('./pool/addPool'));

module.exports = router;