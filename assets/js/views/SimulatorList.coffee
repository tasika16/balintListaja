define (require) ->
  _BaseViews = require '_BaseViews'
  _BaseModels = require '_BaseModels'
  tpl = require 'raw!../../templates/simulator_list.html'
  SimulatorListCollection = require 'collections/SimulatorList'
  SimulatorView = require 'views/Simulator'
  SimulatorAddView = require 'views/SimulatorAdd'
  SimulatorPriceGraphView = require 'views/SimulatorPriceGraph'

  class SimulatorListView extends _BaseViews.CollectionView
    className: 'nt-simulator-list'

    template: tpl

    ItemView: SimulatorView

    itemCont: '.nt-simulator-list-cont'

    initialize: =>
      @model = new _BaseModels.Model search: ''
      @collection ?= new SimulatorListCollection []
    
    initEvents: =>
      super
      @listenTo @collection, 'add remove reset', =>
        @model.set _cnt : @collection.length + ' simulators'
        @model.set _sum : '$' + @sumPrice()

    initNotifierSub: =>
      @notifierSub 'simulator:add', (data) =>
        @collection.comparator = 'name'
        @collection.addItem data,
          error: (model,xhr,options) =>
            if xhr[0].code == 'error_req'
              @notifierPub 'msg:show', 'Connection Error!', 'error'
            @notifierPub 'simulator:error', xhr[0].code
        

      @notifierSub 'simulator:search', (data) =>
        @model.set search: data.name
        @fetchList()
    
    initModelDomBindings: =>
      @addModelDomBinding
        _cnt : '.nt-simulator-cnt'
        _sum : '.nt-simulator-sum'
    
    initDomEvents : =>
      @addDomEvent
        'click .graphModalBtn': =>
          @createChild SimulatorPriceGraphView, collection: @collection
          , 'simulatorPriceGraphView'

    fetchList: =>
      @collection.fetch \
        reset: true, urlParams:search:@model.get('search')
    
    sumPrice: =>
      sum = 0
      @collection.each (m) -> sum += m.get 'price'
      return sum
