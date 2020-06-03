const router = require('express').Router();
const dbsql = require('../dbsql');

router.get('/', async function (req, res) {
  try {
    var q_cat = await dbsql.db_cat.getCategorysByUserID(req.user[0], 1);
    var q_trans = await dbsql.db_trans.getTransactionsByUserID(req.user[0], 1);
  } catch (err) {
    console.log(err);
  }
  return res.render('expenses.html', { username: [req.user[1], req.user[2]], usermail: req.user[3], userphone: req.user[4], userbalance: req.user[5], userpic: req.user[6], pagename: 'expenses', categorys: q_cat, transactions: q_trans });
});

router.post('/', async function (req, res) {
  try {
    //console.log(req.body);

    var debt_free = await dbsql.db_trans.checkBalance(req.user[0], req.body.transactionValue);

    if (debt_free){
      let sqlret = await dbsql.db_trans.insertTransaction(req.body.transactionValue, req.body.timePeriod, req.body.chooseCategory, 1, req.user[0], req.body.repetitionValue, req.body.timeUnit, req.body.dateTimeID, req.body.destinationID, req.body.destinationAccount);
      res.send(sqlret.error); //res.send(req.user[1] + " " + sqlret);

    } else {
      res.send("debts_alert");
    }
  } catch (err) {
    console.log(err);
    res.send("error" + err);
  }
});

module.exports = router;