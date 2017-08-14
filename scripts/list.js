var bookshelf = require('../connection.js')

var Simulators = bookshelf.Model.extend({
  tableName: "simulators"
});

Simulators.forge().orderBy('name', 'ASC').fetchAll()
  .then(function (xs) {
    console.log(xs.toJSON());
    bookshelf.knex.destroy();
  });
