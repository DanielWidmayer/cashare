const router = require('express').Router();
const dbsql = require('../dbsql');

router.post('/add', async function (req, res) {
    try {
      // Write category into database
      console.log(req.body);
      let ret = await dbsql.db_cat.addCategory(req.body.newCategory, req.body.description, req.body.category_isExpense, req.user[0]);
  
      // Read category
      let q_cat = await dbsql.db_cat.getCategoryByCatNameAndUserID(req.user[0], req.body.newCategory, req.body.category_isExpense);
      var q_categorys = JSON.parse(JSON.stringify(q_cat));
  
      console.log(q_categorys);
      res.send(q_categorys);
    } catch (err) {
      console.log(err);
    }
});

module.exports = router;