const dotenv = require('dotenv').config();
// const util = require('util');
const helmet = require('helmet');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const router = express.Router();
const app = express();
const dbsql = require('./dbsql');

if (dotenv.error) throw dotenv.error;

const IN_PROD = process.env.NODE_ENV === 'production';
const TWO_HOURS = process.env.SESS_LIFETIME * 60 * 60 * 2;

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

// Database Connection
dbsql.createConnection(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_PORT, process.env.DB_NAME);
dbsql.db_user.create_table();
dbsql.db_cat.create_table();
dbsql.db_group.create_table();
dbsql.db_user_group.create_table(dbsql.db_user, dbsql.db_group);
dbsql.db_user_cat.create_table(dbsql.db_user, dbsql.db_cat);
dbsql.db_goal.create_table(dbsql.db_cat, dbsql.db_group, dbsql.db_user);
dbsql.db_msg.create_table(dbsql.db_user, dbsql.db_group);
dbsql.db_trans.create_table(dbsql.db_user, dbsql.db_cat, dbsql.db_group);

const redirectLogin = (req, res, next) => {
  //console.log("authentication");
  //console.log(req.originalUrl);
  if (!req.session.userID && req.originalUrl != '/favicon.ico') {
    res.redirect('/login');
  } else {
    next();
  }
};

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

router.get('/home', redirectLogin, async function (req, res) {
  try {
    let q_user = await dbsql.db_user.getDataByID(req.session.userID);
    return res.render('index.html', { username: [q_user[1], q_user[2]], usermail: q_user[3], userphone: q_user[4], userbalance: q_user[5], userpic: q_user[6] });
  }
  catch (err) {
    console.log(err);
    return res.redirect('/login');
  }
});

router.get('/blank', redirectLogin, async function (req, res) {
  let q_user = await dbsql.db_user.getDataByID(req.session.userID);
  return res.render('blank.html', { username: [q_user[1], q_user[2]], usermail: q_user[3], userphone: q_user[4], userbalance: q_user[5], userpic: q_user[6] });
});

router.get('/login', function (req, res) {
  if (req.session.userID) return res.redirect('/home');
  return res.render('login.html');
});

router.post('/login', async function (req, res) {
  let mail = req.body.email;
  let pass = req.body.password;
  //console.log(mail + pass);
  try {
    let user = await dbsql.db_user.login(mail, pass);
    if (user) {
      req.session.userID = user;
      return res.redirect('/home');
    } else {
      return res.redirect('/login');
    }
  } catch (err) {
    console.log(err);
    return res.redirect('/login');
  }
});

router.get('/logout', redirectLogin, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res.redirect('/home');
    }
    res.clearCookie(process.env.SESS_NAME);
    return res.redirect('/login');
  });
});

router.get('/register', function (req, res) {
  //console.log(req);
  //console.log(res);
  return res.render('register.html');
});

router.post('/register', async function (req, res) {
  //res.status(200).json({'success': "User data reached!"});
  console.log('The following data has been received:');
  console.log(req.body);
  try {
    user_res = await dbsql.db_user.registerUser(req.body.firstName, req.body.lastName, req.body.eMail, req.body.password);
    req.session.userID = user_res;
    console.log('redirecting from register to home');
    return res.redirect('/home');
  } catch (err) {
    console.log(err);
    console.log('redirecting back to register');
    return res.redirect('/register');
  }
});

router.get('/tables', redirectLogin, async function (req, res) {
  let q_user = await dbsql.db_user.getDataByID(req.session.userID);
  res.render('logs-tables.html', { username: [q_user[1], q_user[2]], usermail: q_user[3], userphone: q_user[4], userbalance: q_user[5], userpic: q_user[6] });
});

router.get('/income', redirectLogin, async function (req, res) {
  let q_user = await dbsql.db_user.getDataByID(req.session.userID);
  res.render('income.html', { username: [q_user[1], q_user[2]], usermail: q_user[3], userphone: q_user[4], userbalance: q_user[5], userpic: q_user[6] });
});

router.post('/income', redirectLogin, async function (req, res){
  try {
    let q_user = await dbsql.db_user.getDataByID(req.session.userID);
    console.log(req.body);
    res.send(q_user[1] + " " + req.body.transactionValue);
  } catch (err) {
    console.log(err);
  }
});

router.post('/addCategory', redirectLogin, async function (req, res){
  try {
    let q_user = await dbsql.db_user.getDataByID(req.session.userID);
    console.log(req.body);
    res.send(q_user[1] + " " + req.body.newCategory);
  } catch (err) {
    console.log(err);
  }
});

router.get('/groups', redirectLogin, async function (req, res) {
  let q_user = await dbsql.db_user.getDataByID(req.session.userID);
  res.render('payment-groups.html', { username: [q_user[1], q_user[2]], usermail: q_user[3], userphone: q_user[4], userbalance: q_user[5], userpic: q_user[6] });
});

router.get('/groups-shareboard', redirectLogin, async function(req,res) {
  let q_user = await dbsql.db_user.getDataByID(req.session.userID);
  res.render('paymentgroup-shareboard.html', { username: [q_user[1], q_user[2]], usermail: q_user[3], userphone: q_user[4], userbalance: q_user[5], userpic: q_user[6] });
});

router.get('/profile', redirectLogin, async function (req, res) {
  let q_user = await dbsql.db_user.getDataByID(req.session.userID);
  res.render('profile.html', { username: [q_user[1], q_user[2]], usermail: q_user[3], userphone: q_user[4], userbalance: q_user[5], userpic: q_user[6] });
});

router.get('/expenses', redirectLogin, async function (req, res) {
  let q_user = await dbsql.db_user.getDataByID(req.session.userID);
  res.render('expenses.html', { username: [q_user[1], q_user[2]], usermail: q_user[3], userphone: q_user[4], userbalance: q_user[5], userpic: q_user[6] });
});

router.get('/chat', redirectLogin, async function (req, res) {
  let q_user = await dbsql.db_user.getDataByID(req.session.userID);
  res.render('chat.html', { username: [q_user[1], q_user[2]], usermail: q_user[3], userphone: q_user[4], userbalance: q_user[5], userpic: q_user[6] });
});

router.get('/settings', redirectLogin, async function (req, res) {
  let q_user = await dbsql.db_user.getDataByID(req.session.userID);
  res.render('blank.html', { username: [q_user[1], q_user[2]], usermail: q_user[3], userphone: q_user[4], userbalance: q_user[5], userpic: q_user[6] });
});

router.get('/alerts', redirectLogin, async function (req, res) {
  let q_user = await dbsql.db_user.getDataByID(req.session.userID);
  res.render('alerts.html', { username: [q_user[1], q_user[2]], usermail: q_user[3], userphone: q_user[4], userbalance: q_user[5], userpic: q_user[6] });
});

router.get('/try', function (req, res) {
  throw new Error('this was a test, and you failed!');
});

app.use(function (req, res, next) {
  res.setHeader('Cache-Control', 'no-cache, must-revalidate, no-store');
  res.setHeader('Pragma', 'no-cache'); // HTTP 1.0.
  res.setHeader('Expires', '0'); // Proxies.
  next();
});

// handle error 404 - page not found
app.use('*', redirectLogin, function (req, res, next) {
  if (req.originalUrl != '/favicon.ico') return res.render('404.html');
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
