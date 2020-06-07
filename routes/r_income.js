const router = require('express').Router();
const dbsql = require('../dbsql');

// Income
router.get('/', async function (req, res) {
    try {
      var q_cat = await dbsql.db_cat.getCategorysByUserID(req.user[0], 0);
      var q_categories = await dbsql.db_cat.getCategoriesByUserID_json(req.user[0], 0);
      var q_trans = await dbsql.db_trans.getTransactionsByUserID(req.user[0], 0);
      var regular_income_overview = await dbsql.db_trans.getRegularTransactions(req.user[0], false);
      // format time serversided for ejs
      for (const key in regular_income_overview) {
        //regular_income_overview[key]['INTERVAL_VALUE'] = parseInt(regular_income_overview[key]['INTERVAL_VALUE']);
        var datetime;
        if (regular_income_overview[key]['LAST_EXECUTED'] == null){
          datetime = regular_income_overview[key]['STARTS'].toLocaleString();
          // build datetime format: yyyy-mm-dd hh:mm:ss
          datetime = datetime.split(/(T|\.|:|-| )/);         
        }else{
          datetime = regular_income_overview[key]['LAST_EXECUTED'].toLocaleString();
          // build datetime format: yyyy-mm-dd hh:mm:ss
          datetime = datetime.split(/(T|\.|:|-| )/);         
          // calculate next event
          switch (regular_income_overview[key]['INTERVAL_FIELD']) {
            case 'DAY':
              datetime[4] = parseInt(datetime[4]) + parseInt(regular_income_overview[key]['INTERVAL_VALUE']);
              break;
            case 'MONTH':
              datetime[2] = parseInt(datetime[2]) + parseInt(regular_income_overview[key]['INTERVAL_VALUE']);
              break;
            case 'YEAR':
              datetime[0] = parseInt(datetime[0]) + parseInt(regular_income_overview[key]['INTERVAL_VALUE']);
              break;
            default:
              break;
          }
        }        
        // beautify time format
        // beautify time
        var d = new Date();
        if (d.getFullYear() - parseInt(datetime[0]) || d.getMonth() + 1 - parseInt(datetime[2]) || Math.abs(d.getDate() - parseInt(datetime[4])) > 1) {
          regular_income_overview[key]['STARTS'] = datetime[4] + '.' + datetime[2] + '.' + datetime[0];
        } else if (d.getDate() - parseInt(datetime[4]) == -1) {
          regular_income_overview[key]['STARTS'] = datetime[6] + ':' + datetime[8] + ' | tomorrow';
        } else if (d.getHours() - parseInt(datetime[6])) {
          regular_income_overview[key]['STARTS'] = datetime[6] + ':' + datetime[8] + ' | today';
        } else if (!(d.getMinutes() - parseInt(datetime[8]))) {
          regular_income_overview[key]['STARTS'] = 'now';
        } else {
          regular_income_overview[key]['STARTS'] = d.getMinutes() - parseInt(datetime[8]) + ' min';
        }
        
      }
    } catch (err) {
      console.log(err);
    }
    console.log(regular_income_overview);

    return res.render('income.html', { pagename: 'income', categorys: q_cat, categories: q_categories, transactions: q_trans, regular_income: regular_income_overview });
  });
  
router.post('/', async function (req, res) {
  try {
    let sqlret = await dbsql.db_trans.insertTransaction(req.body.transactionValue, req.body.timePeriod, req.body.chooseCategory, 0, req.user[0], req.body.repetitionValue, req.body.timeUnit, req.body.dateTimeID, "", 1);
    res.send(sqlret.error);
  } catch (err) {
    console.log(err);
  }
});

// router.get('/regular_income_overview', async function (req, res) {

//   try {
//     var regular_income_overview = await dbsql.db_trans.getRegularTransactions(req.user[0], false); // false: isExpense = false!
//     res.json(regular_income_overview);
//   } catch (err) {
//     console.log(err);
//   }
// });

router.get('/user_categories', async function (req, res) {
  try {
    var user_categories = await dbsql.db_cat.getCategorysByUserID(req.user[0]); 
  } catch (err) {
    console.log(err);
  }
  res.json(user_categories);
});

router.post('/delete_regular_income', async function (req, res) {
  try {
    let sqlret = await dbsql.db_trans.deleteRegularTransaction(req.body.event_name);
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