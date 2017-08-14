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
  tableName: 'simulators'
});

function displayError(msg) {
  console.log(msg);
  knex.destroy();
}

if (process.argv.length === 5) {
  var tmp_name = process.argv[2];
  var tmp_type_number = process.argv[3];
  var tmp_price = parseInt(process.argv[4]);

  if (typeof tmp_name === 'string' && typeof tmp_type_number === 'string' && 
      Number.isInteger(tmp_price)) {
    Simulators.forge({
      name: tmp_name, 
      type_number: tmp_type_number,
      price: tmp_price
    }).save()
      .then(function () {
        console.log('Succesful backup to database');
        knex.destroy();
      });
  }
  else {
    displayError('Bad Type!');
  }
}
else {
  displayError('Bad params!');
}
