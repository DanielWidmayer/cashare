const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const dbuser = require('../dbsql/db_user');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
    },
    async function(email, password, done) {
        const loginuser = await dbuser.login(email, password);
        if(!loginuser) return done(null, false, { message: "Invalid User Credentials" })
        else {
            const user = await dbuser.getDataByID(loginuser);
            return done(null, user);
        }
    }
));

passport.serializeUser(function(user, cb) {
    cb(null, user[0]);
});

passport.deserializeUser(async function(id, cb) {
    let user = await dbuser.getDataByID(id);
    cb(null, user);
});

module.exports = passport;


