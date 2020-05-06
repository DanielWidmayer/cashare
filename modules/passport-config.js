const LocalStrategy = require('passport-local');

function initialize(passport) {
    const authenticateUser = (email, password, done) => {
        // getUserByMail and match password
    }
    passport.use(new LocalStrategy({ usernameField: ''}),
    authenticateUser)
    passport.serializeUser((user, done) => { })
    passport.deserializeUser((id, done) => { })
}