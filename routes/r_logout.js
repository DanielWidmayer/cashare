const router = require('express').Router();

router.get('/', function (req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        return res.redirect('/home');
      }
      res.clearCookie(process.env.SESS_NAME);
      req.logout();
      return res.redirect('/login');
    });
  });

module.exports = router;