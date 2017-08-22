var is_uuid = require('isuuid');
var express = require('express');
var app = express();
var path = require('path');
var bookshelf = require("./connection.js");
var body_parser = require('body-parser');
var json_parser = body_parser.json();
var urlencoded_parser = body_parser.urlencoded({ extended: false });

var Simulator = bookshelf.Model.extend({
  tableName: "simulators"
});

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/api/simulators', function (req, res) {
  var simulator;
  var search = req.query.search;
  if (search) {
    search = search.replace(/_%/, '');
    simulator = Simulator.query(function (qb) {
      qb.where('name', 'LIKE',
        bookshelf.knex.raw(':searched', { searched: search + '%' }))
    });
  }
  else {
    simulator = Simulator.forge();
  }
  simulator
    .orderBy('name', 'ASC')
    .fetchAll()
    .then(function (content) {
      res.json({ content });
    })
    .catch(function () {
      res.status(500).send({ error: 'Internal server error!' });
    });
});

//todo transaction/semaphore
app.post('/api/simulators', json_parser, function (req, res) {
  //save the database
  if (typeof req.body.name === 'string' && typeof req.body.type_number === 'string'
    && Number.isInteger(parseInt(req.body.price))) {
    Simulator
      .where('type_number', req.body.type_number)
      .fetch()
      .catch(function () {
        res.status(500).send({ error: 'Internal server error!' });
      })
      .then(function (content) {
        if (content === null) {
          new Simulator({
            name: req.body.name,
            type_number: req.body.type_number,
            price: req.body.price
          })
            .save()
            .then(function (content) {
              res.json({ content });
            });
        }
        else {
          res.status(400).send({ error: 'This Type number already exists!' });
        }
      });
  }
  else {
    res.status(400).send({ error: 'Bad Type!' })
  }
});

app.delete('/api/simulators/:id', function (req, res) {
  //delete from the database
  var result = is_uuid(req.params.id);
  if (result) {
    Simulator
      .where('id', req.params.id)
      .destroy()
      .then(function (content) {
        res.send({ content });
      })
      .catch(function () {
        res.status(500).send({ error: 'Internal server error!' });
      })
  }
  else {
    res.status(400).send({ error: 'This is an invalid UUID' });
  }
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