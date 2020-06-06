const router = require('express').Router();
const dbsql = require('../dbsql');

router.get('/', async function (req, res) {
  let alerts = [];
  try {
    let all_alerts = await dbsql.db_alerts.getUnreadAlerts(req.user[0]);
    for (a_ctr = 0; a_ctr < all_alerts.length; a_ctr++) {
      alerts.push({
        'id': all_alerts[a_ctr][dbsql.db_alerts.COLS[0]],
        'class': all_alerts[a_ctr][dbsql.db_alerts.COLS[4]],
        'time': all_alerts[a_ctr][dbsql.db_alerts.COLS[3]].toLocaleString(),
        'text': all_alerts[a_ctr][dbsql.db_alerts.COLS[5]]
      });
    }
  } catch (err) {
    throw (err);
  }
  return res.render('alerts.html', { alerts: alerts, pagename: 'alerts' });
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