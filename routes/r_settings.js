const router = require('express').Router();

router.get('/', function (req, res) {
    return res.render('blank.html', { pagename: 'blank' });
  });

module.exports = router;