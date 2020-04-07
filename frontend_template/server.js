var express = require('express');
var bodyParser = require('body-parser');    // The body-parser is a type of middleware that allows you to handle requests more easily as it can wrap the whole requests body 
var router = express.Router();
var app = express();

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