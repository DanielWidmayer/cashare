const router = require('express').Router();
const dbsql = require('../dbsql');

router.get('/', function (req, res) {
  return res.render('alerts.html', { pagename: 'alerts' });
});

router.post('/read', async function (req, res) {
  let aid = req.body['id'];
  try {
    await dbsql.db_alerts.readSingleAlert(aid);
  } catch (err) {
    console.log(err);
    return 0;
  }
  return 1;
});

module.exports = router;