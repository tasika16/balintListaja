var express = require('express');
var app = express();
var path = require('path');
var bookshelf = require("./connection.js");
var bodyParser = require('body-parser');
var json_parser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var Simulators = bookshelf.Model.extend({
  tableName: "simulators"
});

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/api/simulators', function (req, res) {
  if (req.query.search) {
    Simulators.query(function (qb) {
      qb.where('name', 'LIKE', (req.query.search + '%'))
    }).orderBy('name', 'ASC')
      .fetchAll()
      .then(function (content) {
        res.json({ content });
      });
  }
  else {
    Simulators.forge().orderBy('name', 'ASC').fetchAll()
      .then(function (content) {
        res.json({content});
      });
  }

});

app.post('/api/simulators', json_parser, function (req, res) {
  //save the database
  new Simulators({
    'name': req.body.name,
    'type_number': req.body.type_number,
    'price': req.body.price
  })
    .save()
    .then(function (content) {
      res.json({ content });
    })
});

app.delete('/api/simulators/:id', function (req, res) {
  //delete from the database
  Simulators
    .where('id', req.params.id)
    .destroy()
    .then(function (content) {
      res.send({ content });
    });
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