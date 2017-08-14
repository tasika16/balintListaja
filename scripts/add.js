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

if (process.argv.length === 5) {
  var tmp_name = process.argv[2].toString();
  var tmp_type_number = process.argv[3].toString();
  var tmp_price = parseInt(process.argv[4]);

  if (typeof tmp_name === 'string' && typeof tmp_type_number === 'string' && typeof tmp_price === 'number') {
    Simulators.forge({ name: tmp_name,type_number: tmp_type_number, price: tmp_price }).save()
      .then(function () {
        console.log("Succesful backup to database");
        knex.destroy();
      });
  }
  else {
    console.log("Bad type error!");
  }
}
else {
  console.log("Not enough parameters");
}
