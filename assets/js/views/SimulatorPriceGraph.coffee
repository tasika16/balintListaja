define (require) ->
  _ModalView = require 'views/_Modal'
  tpl = require 'raw!../../templates/simulator_price_graph.html'
  SimulatorView = require 'views/Simulator'
  SimulatorGraphListView = require 'views/SimulatorGraphList'
  SimulatorList = require 'collections/SimulatorList'

  class SimulatorPriceGraph extends _ModalView
    className: 'nt-modal nt-simulator-price-graph position-centered'
    
    template: tpl

    initDomEvents: =>
      super
      @addDomEvent
        'click .nt-modal-close-btn' : @hide

    afterRender: =>
      simulatorGraphListView = @createChild SimulatorGraphListView,
        collection: @collection
      , 'simulatorList'
      
      simulatorGraphListView.$el.appendTo @$('.nt-modal-body')
