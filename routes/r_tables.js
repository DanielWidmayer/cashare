const router = require('express').Router();

router.get('/', function (req, res) {
    return res.render('logs-tables.html', { username: [req.user[1], req.user[2]], usermail: req.user[3], userphone: req.user[4], userbalance: req.user[5], userpic: req.user[6], pagename: 'logs' });
  });

module.exports = router;