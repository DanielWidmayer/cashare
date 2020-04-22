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
  port: '3308',
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
      console.log("No Table user.."); 
      console.log("create Table..");
      var sql = "create table user("
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
   var sql = "SELECT 1 FROM category LIMIT 1;"
  con.query(sql, function (err, result) {
    if (err)
    {
      console.log(err);
      console.log("No table Category.."); 
      console.log("create table..");
      var sql = "create table category("
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
  var sql = "SELECT 1 FROM group LIMIT 1;"
  con.query(sql, function (err, result) {
    if (err)
    {
      console.log(err);
      console.log("No table group.."); 
      console.log("create table..");
      var sql = "create table group("
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
  var sql = "SELECT 1 FROM user_group LIMIT 1;"
  con.query(sql, function (err, result) {
    if (err)
    {
      console.log(err);
      console.log("No table user_group.."); 
      console.log("create table..");
      var sql = "create table user_group("
        +"user_id int(9) not null,"
		+"Foreign Key (user_id) References user(user_id),"
        +"group_id int(9) not null,"
		+"Foreign Key (group_id) REFERENCES group(group_id),"
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
  var sql = "SELECT 1 FROM user_category LIMIT 1;"
  con.query(sql, function (err, result) {
    if (err)
    {
      console.log(err);
      console.log("No table user_category.."); 
      console.log("create table..");
      var sql = "create table user_category("
        +"user_id int(9) not null,"
		+"Foreign Key (user_id) References user(user_id),"
        +"category_id int(9) not null,"
		+"Foreign Key (category_id) REFERENCES category(category_id),"
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
  var sql = "SELECT 1 FROM goal LIMIT 1;"
  con.query(sql, function (err, result) {
    if (err)
    {
      console.log(err);
      console.log("No table goal.."); 
      console.log("create table..");
      var sql = "create table goal("
        +"goal_id int(9) not null auto_increment primary key,"
		+"value decimal(10,2) not null default('0'),"
		+"current decimal(10,2) not null default('0'),"
		+"period_days int(9),"
        +"category_id int(9) not null,"
		+"Foreign Key (category_id) REFERENCES category(category_id),"
		+"group_id int(9),"
		+"Foreign Key (group_id) REFERENCES group(group_id),"
		+"user_id int(9),"
		+"Foreign Key (user_id) REFERENCES user(user_id)"
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
  var sql = "SELECT 1 FROM message LIMIT 1;"
  con.query(sql, function (err, result) {
    if (err)
    {
      console.log(err);
      console.log("No table message.."); 
      console.log("create table..");
      var sql = "create table message("
        +"message_id int(9) not null auto_increment primary key,"
		+"timetag datetime not null,"
		+"text varchar(500) not null"
		+"user_send_id int(9) not null,"
		+"Foreign Key (user_send_id) REFERENCES user(user_id),"
		+"user_receive_id int(9),"
		+"Foreign Key (user_receive_id_id) REFERENCES user(user_id),"
		+"group_id int(9),"
		+"Foreign Key (group_id) REFERENCES group(group_id)"
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
  var sql = "SELECT 1 FROM transaction LIMIT 1;"
  con.query(sql, function (err, result) {
    if (err)
    {
      console.log(err);
      console.log("No table transaction.."); 
      console.log("create table..");
      var sql = "create table transaction("
        +"transaction_id int(9) not null auto_increment primary key,"
		+"transaction_date datetime not null,"
		+"comment varchar(500) not null"
		+"user_id int(9) not null,"
		+"Foreign Key (user_id) REFERENCES user(user_id),"
		+"category_id int(9),"
		+"Foreign Key (category_id) REFERENCES category(category_id),"
		+"group_id int(9),"
		+"Foreign Key (group_id) REFERENCES group(group_id)"
		+"user_receive_id int(9),"
		+"Foreign Key (user_receive_id_id) REFERENCES user(user_id),"
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