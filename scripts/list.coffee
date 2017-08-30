bookshelf = require '../connection2.coffee'

Simulators = bookshelf.Model.extend 
  tableName: 'simulators'

Simulators.forge().orderBy('name','ASC').fetchAll()
  .then (xs)->
    console.log(xs.toJSON())
    bookshelf.knex.destroy()
