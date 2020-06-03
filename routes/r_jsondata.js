const router = require('express').Router();
const dbsql = require('../dbsql');

router.get('/income', async function (req, res) {
    var q_trans = await dbsql.db_trans.getTransactionValueByUserID(req.user[0], 0);
    res.json(q_trans);
  });
  
router.get('/expenses', async function (req, res) {
    var q_trans = await dbsql.db_trans.getTransactionValueByUserID(req.user[0], 1);
    res.json(q_trans);
  });
  
router.get('/overview', async function (req, res) {
    var q_transBalance = await dbsql.db_trans.getPersonalBalance(req.user[0], 1);
    var q_transExpense = await dbsql.db_trans.getTransactionValueByUserID(req.user[0], 1);
    var q_transIncome = await dbsql.db_trans.getTransactionValueByUserID(req.user[0], 0);
  
    var q_trans = { balance : q_transBalance, expense : q_transExpense, income : q_transIncome};
    res.json(q_trans);
  });
router.get('/piechart-expenses', async function(req,res){
  var q_trans = await dbsql.db_trans.getArraysPieChart(req.user[0]);
  res.json(q_trans);
});
router.get('/piechart-incomes', async function(req,res){
  var q_trans = await dbsql.db_trans.getArraysPieChartIncomes(req.user[0]);
  res.json(q_trans);
});
module.exports = router;