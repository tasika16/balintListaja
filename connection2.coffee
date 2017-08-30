config = require './config2'

knex = require('knex')
  client: 'pg'
  connection:
    host: '127.0.0.1'
    user: config.user
    password: config.password
    database: config.database
  
bookshelf = require("bookshelf")(knex)

module.exports = bookshelf

