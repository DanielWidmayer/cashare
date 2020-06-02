const dotenv = require('dotenv').config();
// const util = require('util');
const helmet = require('helmet');
const express = require('express');
const fav = require('serve-favicon');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const router = express.Router();
const passport = require('./modules/passport-config');
//const initializePassPort = require('./modules/passport-config');
const app = express();
const flash = require('connect-flash');
const flash_mw = require('./modules/flashes');
const dbsql = require('./dbsql');


if (dotenv.error) throw dotenv.error;

const IN_PROD = process.env.NODE_ENV === 'production';
const TTL = parseInt(process.env.SESS_LIFETIME);

// Helmet
app.use(helmet());

// Cookies
app.use(cookieParser());

// Session Authentication
app.use(
  session({
    name: process.env.SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESS_SECRET,
    cookie: {
      httpOnly: true,
      maxAge: TTL,
      sameSite: true,
      secure: IN_PROD,
    },
    rolling: true
  })
);

// Serve Favicon
app.use(fav(path.join(__dirname,'public','templates','favicon.ico')));

// Database Connection
dbsql.createConnection(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_PORT, process.env.DB_NAME);
dbsql.connect();

// static folder where static files like html are stored
app.use(express.static('public', { index: false }));
// view folder for the template engine
app.set('views', __dirname + '/public/templates');
// set the template engine to be ejs
app.engine('html', require('ejs').renderFile);
// usage of .html files
app.set('view engine', 'html');
// support parsing of application/x-www-form-urlencoded post data
app.use(
  express.urlencoded({
    extended: true,
  })
);
// support parsing of application/json post data
app.use(express.json());

//passport
app.use(passport.initialize());
app.use(passport.session());


// -------------------------------------------------------------------------------------------------------------------------------- Middleware
// flash middleware - allows to use req.flash()
app.use(flash());
app.use(flash_mw.flashMessage);

// auth middleware  - will redirect user to /login if he tries to access a secure route while not being authenticated
const isAuthenticated = function (req, res, next) {
  console.log("auth - " + req.originalUrl);
  if (req.user) return next();
  else return res.redirect('/login');
}

// home middleware - will redirect already authenticated users to /home if they try to access authentication routes like login or register
const redirectHome = function (req, res, next) {
  if(req.user) return res.redirect('/home');
  else return next();
}

// -------------------------------------------------------------------------------------------------------------------------------- /Middleware

// -------------------------------------------------------------------------------------------------------------------------------- Routes
app.use('/', router);

// Base Page
app.get('/', function (req, res) {            // could be handled in own file as well
  return res.render('home.html');
});

app.use('/home', isAuthenticated, require('./routes/r_home'));

app.use('/login', redirectHome, require('./routes/r_login'));

app.use('/jsondata', isAuthenticated, require('./routes/r_jsondata'));

app.use('/logout', isAuthenticated, require('./routes/r_logout'));

app.use('/register', redirectHome, require('./routes/r_register'));

app.use('/groups', isAuthenticated, require('./routes/r_groups'));

app.use('/income', isAuthenticated, require('./routes/r_income'));

app.use('/category', isAuthenticated, require('./routes/r_category'));

app.use('/expenses', isAuthenticated, require('./routes/r_expense'));

app.use('/settings', isAuthenticated, require('./routes/r_settings'));

app.use('/tables', isAuthenticated, require('./routes/r_tables'));

app.use('/profile', isAuthenticated, require('./routes/r_profile'));

app.use('/chat', isAuthenticated, require('./routes/r_chat'));

app.use('/alerts', isAuthenticated, require('./routes/r_alerts'));

app.get('/blank', isAuthenticated, function (req, res) {        // could be handled in own file as well
  return res.render('blank.html', { username: [req.user[1], req.user[2]], usermail: req.user[3], userphone: req.user[4], userbalance: req.user[5], userpic: req.user[6], pagename: 'index' });
});

// -------------------------------------------------------------------------------------------------------------------------------- /Routes

// app.use(function (req, res, next) {
//   res.setHeader('Cache-Control', 'no-cache, must-revalidate, no-store');
//   res.setHeader('Pragma', 'no-cache'); // HTTP 1.0.
//   res.setHeader('Expires', '0'); // Proxies.
//   next();
// });

// -------------------------------------------------------------------------------------------------------------------------------- Error handler
// handle error 404 - page not found
app.use('*', isAuthenticated, function (req, res, next) {
  return res.render('404.html', { username: [req.user[1], req.user[2]], usermail: req.user[3], userphone: req.user[4], userbalance: req.user[5], userpic: req.user[6], pagename: '404' });
});

// handle any server error
app.use(function (err, req, res, next) {
  console.log('Error handler');
  console.error(err);
  return res.status(500).send({ error: err.message });
});
// -------------------------------------------------------------------------------------------------------------------------------- /Error handler

// -------------------------------------------------------------------------------------------------------------------------------- listen
app.listen(process.env.PORT, function () {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
