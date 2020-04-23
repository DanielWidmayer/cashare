const dotenv = require('dotenv').config();
const util = require('util');
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');    // The body-parser is a type of middleware that allows you to handle requests more easily as it can wrap the whole requests body 
const cookieParser = require('cookie-parser');
const router = express.Router();
const app = express();
const mysql = require('mysql');

if (dotenv.error) throw dotenv.error;

const IN_PROD = process.env.NODE_ENV === 'production';
const TWO_HOURS = process.env.SESS_LIFETIME * 60 * 60 * 2;

// Helmet 
app.use(helmet());

// Cookies
app.use(cookieParser());


// Session Authentication
app.use(session({
  name: process.env.SESS_NAME,
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESS_SECRET,
  cookie: {
    maxAge: TWO_HOURS,
    sameSite: true,
    secure: IN_PROD
  }
}));

// Connect to database
// Node module mysql muss mit "npm install mysql" installiert werden, wenn noch nicht vorhanden..
var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  // Port muss evtl. bei euch angepasst werden..
  port: process.env.DB_PORT,
  // Datenbank "cashare" vor dem starten angelegt werden mit "CREATE DATABASE cashare;"
  database: process.env.DB_NAME
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to database!");
  var sql = "SELECT 1 FROM user_table LIMIT 1;"
  con.query(sql, function (err, result) {
    if (err)
    {
      console.log(err);
      console.log("No Table user.."); 
      console.log("create Table..");
      var sql = "create table user_table("
        +"user_id int(9) not null auto_increment primary key," 
        +"firstName varchar(255) not null,"
        +"lastName varchar(255) not null,"
        +"mail VARCHAR(255) not null,"
        +"password varchar(255) not null,"
		+"phone varchar(255),"
        +"balance decimal(10,2) not null default('0')"
        +");"

      con.query(sql, function(err, result){
          if(err) 
          {
            console.log("cannot create table...");
          }
          else
          {
          console.log("table user created!");// hier weiter machen
          }
      });
    }
    else{
      console.log("table user allready exists!");
    }
  });
   var sql = "SELECT 1 FROM category_table LIMIT 1;"
  con.query(sql, function (err, result) {
    if (err)
    {
      console.log(err);
      console.log("No table Category.."); 
      console.log("create table..");
      var sql = "create table category_table("
        +"category_id int(9) not null auto_increment primary key," 
        +"category_name varchar(255) not null,"
        +"category_description varchar(500) "
        +");"

      con.query(sql, function(err, result){
          if(err) 
          {
            console.log("cannot create table...");
          }
          else
          {
          console.log("table Category created!");// hier weiter machen
          }
      });
    }
    else{
      console.log("table Category allready exists!");
    }
  });
  var sql = "SELECT 1 FROM group_table LIMIT 1;"
  con.query(sql, function (err, result) {
    if (err)
    {
      console.log(err);
      console.log("No table group.."); 
      console.log("create table..");
      var sql = "create table group_table("
        +"group_id int(9) not null auto_increment primary key," 
        +"group_name varchar(255) not null,"
        +"group_description varchar(500),"
		+"group_balance decimal(10,2) not null default('0')"
        +");"

      con.query(sql, function(err, result){
          if(err) 
          {
            console.log("cannot create table...");
          }
          else
          {
          console.log("table group created!");// hier weiter machen
          }
      });
    }
    else{
      console.log("table group allready exists!");
    }
  });
  var sql = "SELECT 1 FROM user_group_table LIMIT 1;"
  con.query(sql, function (err, result) {
    if (err)
    {
      console.log(err);
      console.log("No table user_group.."); 
      console.log("create table..");
      var sql = "create table user_group_table("
        +"user_id int(9) not null,"
		+"Foreign Key (user_id) References user_table(user_id),"
        +"group_id int(9) not null,"
		+"Foreign Key (group_id) REFERENCES group_table(group_id),"
        +"user_role int(5) not null,"
		+"PRIMARY KEY (user_id,group_id)"
        +");"

      con.query(sql, function(err, result){
          if(err) 
          {
            console.log("cannot create table...");
          }
          else
          {
          console.log("table user_group created!");// hier weiter machen
          }
      });
    }
    else{
      console.log("table user_group allready exists!");
    }
  });
  var sql = "SELECT 1 FROM user_category_table LIMIT 1;"
  con.query(sql, function (err, result) {
    if (err)
    {
      console.log(err);
      console.log("No table user_category.."); 
      console.log("create table..");
      var sql = "create table user_category_table("
        +"user_id int(9) not null,"
		+"Foreign Key (user_id) References user_table(user_id),"
        +"category_id int(9) not null,"
		+"Foreign Key (category_id) REFERENCES category_table(category_id),"
        +"category_description varchar(5000),"
		+"PRIMARY KEY (user_id,category_id)"
        +");"

      con.query(sql, function(err, result){
          if(err) 
          {
            console.log("cannot create table...");
          }
          else
          {
          console.log("table user_category created!");// hier weiter machen
          }
      });
    }
    else{
      console.log("table user_category allready exists!");
    }
  });
  var sql = "SELECT 1 FROM goal_table LIMIT 1;"
  con.query(sql, function (err, result) {
    if (err)
    {
      console.log(err);
      console.log("No table goal.."); 
      console.log("create table..");
      var sql = "create table goal_table("
        +"goal_id int(9) not null auto_increment primary key,"
		+"value decimal(10,2) not null default('0'),"
		+"current decimal(10,2) not null default('0'),"
		+"period_days int(9),"
        +"category_id int(9) not null,"
		+"Foreign Key (category_id) REFERENCES category_table(category_id),"
		+"group_id int(9),"
		+"Foreign Key (group_id) REFERENCES group_table(group_id),"
		+"user_id int(9),"
		+"Foreign Key (user_id) REFERENCES user_table(user_id)"
        +");"

      con.query(sql, function(err, result){
          if(err) 
          {
            console.log("cannot create table...");
          }
          else
          {
          console.log("table goal created!");// hier weiter machen
          }
      });
    }
    else{
      console.log("table goal allready exists!");
    }
  });
  var sql = "SELECT 1 FROM message_table LIMIT 1;"
  con.query(sql, function (err, result) {
    if (err)
    {
      console.log(err);
      console.log("No table message.."); 
      console.log("create table..");
      var sql = "create table message_table("
        +"message_id int(9) not null auto_increment primary key,"
		+"timetag datetime not null,"
		+"text varchar(500) not null"
		+"user_send_id int(9) not null,"
		+"Foreign Key (user_send_id) REFERENCES user_table(user_id),"
		+"user_receive_id int(9),"
		+"Foreign Key (user_receive_id_id) REFERENCES user_table(user_id),"
		+"group_id int(9),"
		+"Foreign Key (group_id) REFERENCES group_table(group_id)"
        +");"

      con.query(sql, function(err, result){
          if(err) 
          {
            console.log("cannot create table...");
          }
          else
          {
          console.log("table message created!");// hier weiter machen
          }
      });
    }
    else{
      console.log("table message allready exists!");
    }
  });
  var sql = "SELECT 1 FROM transaction_table LIMIT 1;"
  con.query(sql, function (err, result) {
    if (err)
    {
      console.log(err);
      console.log("No table transaction.."); 
      console.log("create table..");
      var sql = "create table transaction_table("
        +"transaction_id int(9) not null auto_increment primary key,"
		+"transaction_date datetime not null,"
		+"comment varchar(500) not null"
		+"user_id int(9) not null,"
		+"Foreign Key (user_id) REFERENCES user_table(user_id),"
		+"category_id int(9),"
		+"Foreign Key (category_id) REFERENCES category_table(category_id),"
		+"group_id int(9),"
		+"Foreign Key (group_id) REFERENCES group_table(group_id)"
		+"user_receive_id int(9),"
		+"Foreign Key (user_receive_id) REFERENCES user_table(user_id),"
		+"receive varchar(255)"
        +");"

      con.query(sql, function(err, result){
          if(err) 
          {
            console.log("cannot create table...");
          }
          else
          {
          console.log("table transaction created!");// hier weiter machen
          }
      });
    }
    else{
      console.log("table transaction allready exists!");
    }
  });
});

const query = util.promisify(con.query).bind(con);

const redirectLogin = (req, res, next) => {
  if(!req.session.userID) {
    res.redirect('/login');
  } else {
    next();
  }
}


// static folder where static files like html are stored
app.use(express.static('public', { index: false }));
// view folder for the template engine
app.set('views', __dirname + '/public');
// set the template engine to be ejs
app.engine('html', require('ejs').renderFile);
// usage of .html files
app.set('view engine', 'html');

// support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({
  extended: true
}));
// support parsing of application/json post data
app.use(bodyParser.json());

app.use('/',router);

router.get('/', redirectLogin, async function (req, res) {
  console.log(req.cookies);
  if (req.session.userID) {
    let sql = `SELECT firstName, lastName FROM user_table WHERE userid = '${req.session.userID}';`
    let user = await query(sql);
    res.render('index.html', { user: user[0] });
  }
  else {
    res.redirect('/login');
  }
});

router.get('/blank', redirectLogin, function (req, res) {
  
  res.render('blank.html');
});

router.get('/login', function (req, res) {
  console.log(req.cookies);
  if(req.session.userID) res.redirect('/');
  res.render('login.html');
});

router.post('/login', async function(req, res){
  let mail = req.body.email;
  let pass = req.body.password;
  let user;
  let f1 = false;
  console.log(mail + pass);
  var sql = `SELECT userid, password FROM user_table WHERE email = '${mail}';`;
  try {
    user = await query(sql);
    f1 = await bcrypt.compare(pass, user[0].password);
    console.log(user);
  } catch(err){
    console.log(err);
  }
  console.log("outside try");
  if(!f1) res.redirect('/login');
  else {
    req.session.userID = user[0].userid;
    res.redirect('/');
  }
}); 

router.post('/logout', redirectLogin, (req, res) => {
  req.session.destroy(err => {
    if(err) {
      return res.redirect('/');
    }
    res.clearCookie(process.env.SESS_NAME);
    res.redirect('/login');
  });
});

router.get('/register', function (req, res) {
  res.render('register.html');
});

router.post('/register', async function(req, res){
  res.status(200).json({'success': "User data reached!"});
  console.log("The following data has been received:");
  console.log(req.body);
  console.log("Insert data to table user...");
  try {
    user_res = await createUser(req.body.firstName, req.body.lastName, req.body.eMail, req.body.password);
  }
  catch (err) {
    console.log(err);
  }
  
  res.redirect('/');
});

router.get('/tables', redirectLogin, function(req, res) {
  
  res.render('tables.html');
});

router.get('/try', function (req, res) {
  throw new Error('this was a test, and you failed!');
});

app.use(function(req, res, next) {
  res.setHeader("Cache-Control", "no-cache, must-revalidate, no-store");
  res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
  res.setHeader("Expires", "0"); // Proxies.
  next();
});

// handle error 404 - page not found
app.use('*', redirectLogin, function(req, res, next) {
  res.render('404.html');
});

// handle any server error
app.use(function(err, req, res, next) {
  console.error(err);
  res.status(500).send({ error: err.message });
});


app.listen(process.env.PORT, function () {
  console.log(`Example app listening on port ${process.env.PORT}`);
});

async function createUser(firstName, lastName, eMail, password)
{
  let sql = `SELECT userid FROM user_table WHERE eMail = '${eMail}';`
  let res = await query(sql);
  password = await bcrypt.hash(password, 10);
  console.log(res);
  if(res.length == 0) {
    sql = `INSERT INTO user_table (firstName, lastName, eMail, password) VALUES ('${firstName}','${lastName}','${eMail}','${password}');`;
    res = await query(sql);
    console.log(res);
  }
  else {
    console.log("Mail is already used");
  }
};