var express = require('express');
var bodyParser = require('body-parser');    // The body-parser is a type of middleware that allows you to handle requests more easily as it can wrap the whole requests body 
var router = express.Router();
var app = express();
var mysql = require('mysql');

// Connect to database
// Node module mysql muss mit "npm install mysql" installiert werden, wenn noch nicht vorhanden..
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  // Port muss evtl. bei euch angepasst werden..
  port: '3306',
  // Datenbank "cashare" vor dem starten angelegt werden mit "CREATE DATABASE cashare;"
  database: 'cashare'
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to database!");
  var sql = "SELECT 1 FROM user LIMIT 1;"
  con.query(sql, function (err, result) {
    if (err)
    {
      console.log(err);
      console.log("No Database user.."); 
      console.log("create databaase..");
      var sql = "create table user("
        +"userid int(9) not null auto_increment primary key," 
        +"firstName varchar(255) not null,"
        +"lastName varchar(255) not null,"
        +"email VARCHAR(255) not null,"
        +"password varchar(255) not null,"
        +"balance decimal(10,2) not null default('0')"
        +");"

      con.query(sql, function(err, result){
          if(err) 
          {
            console.log("cannot create database...");
          }
          else
          {
          console.log("database user created!");// hier weiter machen
          }
      });
    }
    else{
      console.log("database user allready exists!");
    }
  });
});


// static folder where static files like html are stored
app.use(express.static('public'));
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

router.get('/', function (req, res) {
  res.render('index.html');
});

router.get('/blank', function (req, res) {
  res.render('blank.html');
});

router.get('/login', function (req, res) {
  res.render('login.html');
});

router.get('/register', function (req, res) {
  res.render('register.html');
});

router.post('/register', function(req, res){
  res.status(200).json({'success': "User data reached!"});
  console.log("The following data has been received:");
  console.log(req.body);
  console.log("Insert data to table user...");
  createUser(req.body.firstName, req.body.lastName, req.body.eMail, req.body.password)
});

router.get('/tables', function(req, res) {
  res.render('tables.html');
});

router.get('/try', function (req, res) {
  throw new Error('this was a test, and you failed!');
});


// handle error 404 - page not found
app.use('*', function(req, res, next) {
  res.render('404.html');
});

// handle any server error
app.use(function(err, req, res, next) {
  console.error(err);
  res.status(500).send({ error: err.message });
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

function createUser(firstName, lastName, eMail, password)
{
  var sql = `INSERT INTO user (firstName, lastName, eMail, password) VALUES ('${firstName}','${lastName}','${eMail}','${password}');`;
  con.query(sql, function(err, result){
    if(err)
    {
      console.log("There was a problem by adding a new user..");
      console.log(err);
    }
    else{
      console.log("Added user successfull!");
      console.log(result);
    }
  })
};