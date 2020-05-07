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
            console.log(user);
            return done(null, user);
        }
    }
));

passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

module.exports = passport;
/*module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' , passwordField: 'password' }, (email, password, done) => {
            console.log("inside check");
            console.log(email + " " + password);
            dbuser.login(email, password, (err, user) => {
                if(err) return done(err);
                if(user) return done(null, user);
                else return done(null, false, { message: 'Invalid User Credentials' });
            });
        })
    )

    passport.serializeUser( (user, done) => {
        done(null, user);
    })

    passport.deserializeUser( (id, done) => {
        dbuser.getDataByID(id, (err, user) => {
            done(err, user);
        })
    })
}*/

