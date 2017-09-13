define (require) -> 
  _BaseCollections = require '_BaseCollections'
  Simulator = require 'models/Simulator'

  class SimulatorList extends _BaseCollections.Collection
    model: Simulator
      