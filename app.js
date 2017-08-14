var express = require('express');
var app = express();
var path = require('path');

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.listen(3000);

/*
POST /api/simulators
- data: json
- - example: {name: valami, ...}
- response: json + id
- - example: {content: {id: 1234,name: asd ...}}
GET /api/simulators
- param: search
- response: json(array)
- - example: {content: [{id: 1234, name: ...},{id: 4567, name: ...}]}
DELETE /api/simulators/:id
- response: {content: {}}
*/