define (require) ->
  _ = require 'underscore'
  _BaseViews = require '_BaseViews'
  _BaseModels = require '_BaseModels'
  tpl = require 'raw!../../templates/simulator_list.html'
  SimulatorListCollection = require 'collections/SimulatorList'
  SimulatorView = require 'views/Simulator'
  SimulatorAddView = require 'views/SimulatorAdd'
  SimulatorPriceGraphView = require 'views/SimulatorPriceGraph'
  bindhelpers = require 'bindhelpers'
  utils = require 'utils'

  class SimulatorListView extends _BaseViews.CollectionView
    className: 'nt-simulator-list'

    template: tpl

    ItemView: SimulatorView

    itemCont: '.nt-simulator-list-cont'
    mod = '_sortName'

    initialize: =>
      @model = new _BaseModels.Model search: '', _sortName: 'asc',
      _sortTNumber: '', _sortPrice: ''
      @collection ?= new SimulatorListCollection []
      
    initEvents: =>
      super
      @listenTo @collection, 'add remove reset', =>
        @model.set _cnt : @collection.length + ' simulators'
        @model.set _sum : '$' + @sumPrice()
      
      @listenTo @collection, 'sort', => @render()


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
        _sortName : bindhelpers.class '[data-col=name]', (dir, val) ->
          if dir is 'ModelToView'
            if val then "nt-#{val}"
        _sortTNumber : bindhelpers.class '[data-col=type_number]', (dir, val) ->
          if dir is 'ModelToView'
            if val then "nt-#{val}"
        _sortPrice : bindhelpers.class '[data-col=price]', (dir, val) ->
          if dir is 'ModelToView'
            if val then "nt-#{val}"

    
    initDomEvents : =>
      @addDomEvent
        'click .graphModalBtn': =>
          @createChild SimulatorPriceGraphView, collection: @collection
          , 'simulatorPriceGraphView'

        'click .nt-sort': (e) ->
          comp = $(e.target).closest('div').data 'col'
          
          if comp == 'name' && (@model.get '_sortName') == ''
            @model.set _sortName : 'asc'
            @model.set _sortTNumber : ''
            @model.set _sortPrice : ''
            mod = '_sortName'
          else if comp == 'type_number' && (@model.get '_sortTNumber') == ''
            @model.set _sortTNumber : 'asc'
            @model.set _sortName : ''
            @model.set _sortPrice : ''
            mod = '_sortTNumber'
          else if comp == 'price' && (@model.get '_sortPrice') == ''
            @model.set _sortPrice : 'asc'
            @model.set _sortName : ''
            @model.set _sortTNumber : ''
            mod = '_sortPrice'
          
          if (@model.get mod) == 'asc'
            sortArr = [
              name: comp
              opts:desc:true
            ]
          if (@model.get mod) =='desc'
            sortArr = [
              name: comp
              opts:asc:true
            ]

          @collection.comparator = (a,b) -> utils.sort a, b, sortArr
          @collection.sort()

          if (@model.get mod) == 'asc'
            if comp == 'name' then @model.set _sortName: 'desc'
            else if comp == 'type_number' then @model.set _sortTNumber: 'desc'
            else if comp == 'price' then @model.set _sortPrice : 'desc'
          else if (@model.get mod) == 'desc'
            if comp == 'name' then @model.set _sortName: 'asc'
            else if comp == 'type_number' then @model.set _sortTNumber: 'asc'
            else if comp == 'price' then @model.set _sortPrice : 'asc'

    fetchList: =>
      @collection.fetch \
        reset: true, urlParams:search:@model.get('search')
    
    sumPrice: =>
      sum = 0
      @collection.each (m) -> sum += m.get 'price'
      return sum
