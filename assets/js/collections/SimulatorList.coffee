define (require) -> 
  _BaseCollections = require '_BaseCollections'
  Simulator = require 'models/Simulator'

  class SimulatorList extends _BaseCollections.Collection
    
    url: '/simulators'
    model: Simulator
  
    maxPrice: =>
      maximum = @collection.max (m) -> m.get 'price'

    sumPrice: =>
      sum = 0
      @.each (m) -> sum += m.get 'price'
      return sum
    