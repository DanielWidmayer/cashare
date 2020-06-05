const router = require('express').Router();
const passport = require('../modules/passport-config');

router.get('/', function (req, res) {
    if (req.user) return res.redirect('/home');
    return res.render('login.html');
});
  
router.post('/', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), function (req, res) {
    return res.redirect('/home');
});

router.get('/forgotpwd', function (req, res) {
    return res.render('forgot-password.html'); 
});

module.exports = router;