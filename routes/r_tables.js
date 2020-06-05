const router = require('express').Router();

router.get('/', function (req, res) {
    return res.render('logs-tables.html', { pagename: 'logs' });
  });

module.exports = router;