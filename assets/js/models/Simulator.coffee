define (require) -> 
  _BaseModels = require '_BaseModels'

  class Simulator extends _BaseModels.ParentModel 
    validate: (attrs, opts) =>
      if opts.isEmpty
        if !attrs.name? || !attrs.type_number? || !attrs.price?
          'Please fill every field!'
        else if !(Number.isInteger parseInt attrs.price)
          ' Please fill the price field just number!'
      else if attrs.name == '' || attrs.type_number == '' || attrs.price == ''
        'Please fill every field!'
        if !(Number.isInteger parseInt attrs.price)
          ' Please fill the price field just number!'