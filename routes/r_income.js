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
    return res.render('income.html', { username: [req.user[1], req.user[2]], usermail: req.user[3], userphone: req.user[4], userbalance: req.user[5], userpic: req.user[6], pagename: 'income', categorys: q_cat, transactions: q_trans });
});
  
router.post('/', async function (req, res) {
  try {
    let sqlret = await dbsql.db_trans.insertTransaction(req.body.transactionValue, req.body.timePeriod, req.body.chooseCategory, 0, req.user[0], req.body.repetitionValue, req.body.timeUnit, req.body.dateTimeID, "", 1);
    res.send(sqlret.error);
  } catch (err) {
    console.log(err);
  }
});

router.get('/regular_income_overview', async function (req, res) {
  var regular_income_overview = await dbsql.db_trans.getRegularTransactions(req.user[0], false); // false: isExpense = false!
  res.json(regular_income_overview);
});

router.get('/user_categories', async function (req, res) {
  console.log(req.user[0]);
  var user_categories = await dbsql.db_cat.getCategorysByUserID(req.user[0]); 
  res.json(user_categories);
});

module.exports = router;