var is_uuid = require('isuuid');
var express = require('express');
var app = express();
var path = require('path');
var bookshelf = require("./connection.js");
var body_parser = require('body-parser');
var json_parser = body_parser.json();

var Simulator = bookshelf.Model.extend({
  tableName: "simulators"
});

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

function handleError(status_code, message) {
  res.status(status_code).send({ error: message });
}

app.get('/api/simulators', function (req, res) {
  var simulator;
  var search = req.query.search;
  if (search) {
    search = search.replace(/_%/, '');
    simulator = Simulator.query(function (qb) {
      qb.where('name', 'LIKE', bookshelf.knex.raw('?', [search + '%']))
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
      handleError(500, 'Internal Server Error!');
    });
});

//todo transaction/semaphore
app.post('/api/simulators', json_parser, function (req, res) {
  //save the database
  if (req.body.name.trim() !== '' && req.body.type_number.trim() !== '') {
    if (typeof req.body.name === 'string' && typeof req.body.type_number === 'string' &&
      Number.isInteger(parseInt(req.body.price))) {
      Simulator
        .where('type_number', req.body.type_number)
        .fetch()
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
            handleError(400, 'This Type number already exists!');
          }
        })
        .catch(function () {
          handleError(500, 'Internal Server Error!');
        });
    }
    else {
      handleError(400, 'Bad Type!');
    }
  }
  else {
    handleError(400, 'None of the fields can be empty');
  }
});

app.delete('/api/simulators/:id', function (req, res) {
  //delete from the database
  if (is_uuid(req.params.id)) {
    Simulator
      .where('id', req.params.id)
      .destroy()
      .then(function (content) {
        res.send({ content });
      })
      .catch(function () {
        handleError(500, 'Internal Server Error!');
      })
  }
  else {
    handleError(400, 'This is an invalid UUID');
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