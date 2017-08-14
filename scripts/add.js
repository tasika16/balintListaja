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

//console.log(typeof process.argv[2]);
//console.log(typeof process.argv[3]);

var tmpName = process.argv[2].toString();
var tmpPrice = parseInt(process.argv[3]);

console.log(tmpName," : ",typeof tmpName);
console.log(tmpPrice," : ",typeof tmpPrice);

var Simulators = bookshelf.Model.extend({
    tableName : "simulators"
});

if(process.argv.length === 4){
    if(typeof tmpName === 'string' && typeof tmpPrice === 'number'){
        Simulators.forge({name: tmpName, price: tmpPrice}).save()
        .then(function (){
            console.log("Succesful backup to database");
            knex.destroy();
        });
    }
    else{
        console.log("Bad type error!");
    }
}
else{
    console.log("Not enough parameters");
}
