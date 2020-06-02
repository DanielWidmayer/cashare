const router = require('express').Router();
const dbsql = require('../dbsql');

router.get('/', function (req, res) {

    return res.render('register.html', { errmsg: 0 });
  });
  
  router.post('/', async function (req, res) {
    //res.status(200).json({'success': "User data reached!"});
    console.log('The following data has been received:');
    console.log(req.body);
    try {
      user_res = await dbsql.db_user.registerUser(req.body.firstName, req.body.lastName, req.body.eMail, req.body.password);
      return res.redirect('/login');
    } catch (err) {
      console.log(err);
      return res.render('register.html', { errmsg: err });
    }
  });

module.exports = router;