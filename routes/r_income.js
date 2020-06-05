const router = require('express').Router();
const dbsql = require('../dbsql');

// Income
router.get('/', async function (req, res) {
    try {
      var q_cat = await dbsql.db_cat.getCategorysByUserID(req.user[0], 0);
      var q_trans = await dbsql.db_trans.getTransactionsByUserID(req.user[0], 0);
    } catch (err) {
      console.log(err);
    }
    return res.render('income.html', { pagename: 'income', categorys: q_cat, transactions: q_trans });
  });
  
  router.post('/', async function (req, res) {
    try {
      let sqlret = await dbsql.db_trans.insertTransaction(req.body.transactionValue, req.body.timePeriod, req.body.chooseCategory, 0, req.user[0], req.body.repetitionValue, req.body.timeUnit, req.body.dateTimeID, "", 1);
      res.send(sqlret.error);
    } catch (err) {
      console.log(err);
    }
  });

module.exports = router;