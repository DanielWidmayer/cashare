var express = require('express');
var router = express.Router();
var app = express();

app.use(express.static('public'));

app.use('/',router);

router.get('/', function (req, res) {
  res.render('index.html');
});

app.use('*',function(req, res){
  res.send('Error 404: Not Found!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});