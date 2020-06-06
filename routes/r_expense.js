const router = require('express').Router();
const dbsql = require('../dbsql');

router.get('/', async function (req, res) {
  try {
    var q_cat = await dbsql.db_cat.getCategorysByUserID(req.user[0], 1);
    var q_trans = await dbsql.db_trans.getTransactionsByUserID(req.user[0], 1);
  } catch (err) {
    console.log(err);
  }
  return res.render('expenses.html', { pagename: 'expenses', categorys: q_cat, transactions: q_trans });
});

router.post('/', async function (req, res) {
  try {
    var debt_free = await dbsql.db_trans.checkBalance(req.user[0], req.body.transactionValue);

    if (debt_free){
      let sqlret = await dbsql.db_trans.insertTransaction(req.body.transactionValue, req.body.timePeriod, req.body.chooseCategory, 1, req.user[0], req.body.repetitionValue, req.body.timeUnit, req.body.dateTimeID, req.body.destinationID, req.body.destinationAccount);
      res.send(sqlret.error);

    } else {
      res.send("debts_alert");
    }
  } catch (err) {
    console.log(err);
    res.send("error" + err);
  }
});

router.get('/user_categories', async function (req, res) {
  var user_categories = await dbsql.db_cat.getCategorysByUserID(req.user[0], true); 
  console.log(user_categories);
  res.json(user_categories);
});

router.post('/insert_payment_goal', async function (req, res) {
  try {
    let sqlret = await dbsql.db_goal.insertPaymentGoal(req.body.value, req.body.title, req.body.category, null, req.user[0]);
    if(sqlret == 0){
      res.sendStatus(200);
    } else{
      res.sendStatus(500);
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;