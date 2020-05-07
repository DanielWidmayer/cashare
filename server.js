const dotenv = require('dotenv').config();
// const util = require('util');
const helmet = require('helmet');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const router = express.Router();
const passport = require('./modules/passport-config');
//const initializePassPort = require('./modules/passport-config');
const app = express();
const flash = require('express-flash');
const dbsql = require('./dbsql');
const upload = require('./modules/pic_upload');

if (dotenv.error) throw dotenv.error;

const IN_PROD = process.env.NODE_ENV === 'production';
const TWO_HOURS = process.env.SESS_LIFETIME * 60 * 2;
app.use(flash());
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
      maxAge: TWO_HOURS,
      sameSite: true,
      secure: IN_PROD,
    },
  })
);

//passport
app.use(passport.initialize());
app.use(passport.session());

// Database Connection
dbsql.createConnection(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_PORT, process.env.DB_NAME);
dbsql.connect();


// auth middleware
const isAuthenticated = function (req, res, next) {
  console.log("auth");
  if(req.user && req.originalUrl != '/favicon.ico') {
    return next();
  }
  return res.redirect('/login');
}

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

app.use('/', router);

router.get('/', function (req, res) {
  return res.render('home.html');
});

router.get('/home', isAuthenticated, async function (req, res) {
    return res.render('index.html', { username: [req.user[1], req.user[2]], usermail: req.user[3], userphone: req.user[4], userbalance: req.user[5], userpic: req.user[6], pagename: 'index' });
});

router.get('/blank', isAuthenticated, async function (req, res) {
    return res.render('blank.html', { username: [req.user[1], req.user[2]], usermail: req.user[3], userphone: req.user[4], userbalance: req.user[5], userpic: req.user[6], pagename: 'index' });
});

router.get('/login', function (req, res) {
  if (req.user) return res.redirect('/home');
  return res.render('login.html', { errflash: req.flash() });
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login' , failureFlash: true }), function(req, res) {
  return res.redirect('/home');
});


router.get('/logout', isAuthenticated, (req, res) => {
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

router.get('/register', function (req, res) {
  return res.render('register.html');
});

router.post('/register', async function (req, res) {
  //res.status(200).json({'success': "User data reached!"});
  console.log('The following data has been received:');
  console.log(req.body);
  try {
    user_res = await dbsql.db_user.registerUser(req.body.firstName, req.body.lastName, req.body.eMail, req.body.password);
    //req.session.userID = user_res;
    //console.log('redirecting from register to login');
    return res.redirect('/login');
  } catch (err) {
    console.log(err);
    //console.log('redirecting back to register');
    return res.redirect('/register');
  }
});

router.get('/tables', isAuthenticated, async function (req, res) {
    return res.render('logs-tables.html', { username: [req.user[1], req.user[2]], usermail: req.user[3], userphone: req.user[4], userbalance: req.user[5], userpic: req.user[6], pagename: 'logs' });
});

router.get('/income', isAuthenticated, async function (req, res) {
    return res.render('income.html', { username: [req.user[1], req.user[2]], usermail: req.user[3], userphone: req.user[4], userbalance: req.user[5], userpic: req.user[6], pagename: 'income' });
});

router.get('/groups', isAuthenticated, async function (req, res) {
    return res.render('payment-groups.html', { username: [req.user[1], req.user[2]], usermail: req.user[3], userphone: req.user[4], userbalance: req.user[5], userpic: req.user[6], pagename: 'groups' });
});

router.get('/profile', isAuthenticated, async function (req, res) {
    return res.render('profile.html', { username: [req.user[1], req.user[2]], usermail: req.user[3], userphone: req.user[4], userpic: req.user[6], pagename: 'profile' });
});

router.post('/profile', isAuthenticated, upload.single('pic'), async function (req, res) {
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

router.get('/expenses', isAuthenticated, async function (req, res) {
    return res.render('expenses.html', { username: [req.user[1], req.user[2]], usermail: req.user[3], userphone: req.user[4], userbalance: req.user[5], userpic: req.user[6], pagename: 'expenses' });
});

router.get('/chat', isAuthenticated, async function (req, res) {
    return res.render('chat.html', { username: [req.user[1], req.user[2]], usermail: req.user[3], userphone: req.user[4], userbalance: req.user[5], userpic: req.user[6], pagename: 'chat' });
});

router.get('/settings', isAuthenticated, async function (req, res) {
    return res.render('blank.html', { username: [req.user[1], req.user[2]], usermail: req.user[3], userphone: req.user[4], userbalance: req.user[5], userpic: req.user[6], pagename: 'blank' });
});

router.get('/alerts', isAuthenticated, async function (req, res) {
    return res.render('alerts.html', { username: [req.user[1], req.user[2]], usermail: req.user[3], userphone: req.user[4], userbalance: req.user[5], userpic: req.user[6], pagename: 'alerts' });
});

router.get('/try', isAuthenticated, function (req, res) {
  throw new Error('this was a test, and you failed!');
});

app.use(function (req, res, next) {
  res.setHeader('Cache-Control', 'no-cache, must-revalidate, no-store');
  res.setHeader('Pragma', 'no-cache'); // HTTP 1.0.
  res.setHeader('Expires', '0'); // Proxies.
  next();
});

// handle error 404 - page not found
app.use('*', isAuthenticated, async function (req, res, next) {
  if (req.originalUrl != '/favicon.ico') {
      return res.render('404.html', { username: [req.user[1], req.user[2]], usermail: req.user[3], userphone: req.user[4], userbalance: req.user[5], userpic: req.user[6], pagename: '404' });
  }
});

// handle any server error
app.use(function (err, req, res, next) {
  console.log('Error handler');
  console.error(err);
  return res.status(500).send({ error: err.message });
});

app.listen(process.env.PORT, function () {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
