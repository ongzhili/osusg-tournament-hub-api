const express = require('express');
const router = express.Router();
const db = require('../../services/firebase');

// Assumes Firebase Admin SDK is initialized elsewhere in your project
function getTodayDateStr() {
    const now = new Date();
    // Convert to GMT+8
    const gmt8 = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    const dd = String(gmt8.getUTCDate()).padStart(2, '0');
    const mm = String(gmt8.getUTCMonth() + 1).padStart(2, '0');
    const yy = String(gmt8.getUTCFullYear()).slice(-2);
    return `${dd}${mm}${yy}`;
}

router.get('/', async (req, res) => {
    let date = req.query.date;
    if (!date) {
        date = getTodayDateStr();
    }

    let page = req.query.page;
    if (!page) {
        page = 1
    }

    const pageSize = parseInt(process.env.PAGE_SIZE) || 50;

    try {
        const usersRef = db
            .collection('users')
            .doc(date)
            .collection('users')
            .orderBy('country_rank', 'asc')
            .startAfter((page - 1) * pageSize)
            .limit(pageSize)
            
        const snapshot = await usersRef.get();

        const users = snapshot.docs.map(doc => doc.data());

        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;