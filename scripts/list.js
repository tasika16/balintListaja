var knex = require('knex')({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'tasika161',
    password: 'lekvarosbukta',
    database: 'tasika161_dev'
  }
});

var bookshelf = require('bookshelf')(knex);

var Simulators = bookshelf.Model.extend({
  tableName: "simulators"
});

Simulators.fetchAll()
  .then(function (xs) {
    console.log(xs.toJSON());
    knex.destroy();
  });
