const router = require('express').Router();
const passport = require('../modules/passport-config');

const TTL_REM = 2592000000;

router.get('/', function (req, res) {
    if (req.user) return res.redirect('/home');
    return res.render('login.html');
});
  
router.post('/', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), function (req, res) {
    if(req.body.remember) req.session.cookie.maxAge = TTL_REM;
    return res.redirect('/home');
});

router.get('/forgotpwd', function (req, res) {
    return res.render('forgot-password.html'); 
});

module.exports = router;