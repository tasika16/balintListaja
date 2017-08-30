bookshelf = require '../connection2'

Simulators = bookshelf.Model.extend  tablename: 'simulators'

displayError = (msg) -> 
  #console.log(msg)
  bookshelf.knex.destroy()
  return null

if process.argv.length == 5
  tmp_name = process.argv[2]
  tmp_type_number = process.argv[3]
  tmp_price = parseInt process.argv[4]
  
  if typeof tmp_name == 'string' && typeof tmp_type_number == 'string' &&
     Number.isInteger tmp_price
    Simulators.forge 
      name: tmp_name
      type_number: tmp_type_number
      price: tmp_price
    .save()
    .then ->
      console.log 'Succesful backup to database'
      bookshelf.knex.destroy()
      null
  else 
    displayError 'Bad type'
else 
  displayError 'Bad params'