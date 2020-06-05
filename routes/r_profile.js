const router = require('express').Router();
const upload = require('../modules/pic_upload');
const dbsql = require('../dbsql');

router.get('/', function (req, res) {
    return res.render('profile.html', { pagename: 'profile' });
  });
  
  router.post('/', upload.single('pic'), async function (req, res) {
    try {
      if (req.file) {
        await dbsql.db_user.changeProfileImg(req.user[0]);
      }
      else {
        await dbsql.db_user.changeNameAndMail(req.user[0], req.body.firstname, req.body.lastname, req.body.mail);
        if (req.body.old_password && req.body.new_password) {
          await dbsql.db_user.changePassword(req.user[0], req.body.old_password, req.body.new_password);
        }
      }
    } catch (err) {
      console.log(err);
    }
    let temp = await dbsql.db_user.getDataByID(req.user[0]);
    req.login(temp, (err) => {
      if (err) return next(err);
      return res.redirect(req.originalUrl);
    })
});

module.exports = router;