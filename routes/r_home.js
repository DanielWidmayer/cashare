const router = require('express').Router();
const dbsql = require('../dbsql');


// Home - Cashboard
router.get('/', async function (req, res) {
    return res.render('index.html', { pagename: 'index' });
});

module.exports = router;