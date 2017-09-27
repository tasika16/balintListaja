var express = require('express');
var app = express();
var path = require('path');

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.redirect('/main');
});

app.get('/main',function(req,res) {
  res.sendFile(path.join(__dirname+'/index.html'));
})

var port = 3001

app.listen(port);

console.log('Listening on ' + port);