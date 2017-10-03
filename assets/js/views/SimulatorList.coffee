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

    #emptyMsg: 'no_simulator'

    mod = '_sort_name'

    initialize: =>
      @collection ?= new SimulatorListCollection []
      @collection.autoSave = true
      @model = new _BaseModels.Model 
        search: '', 
        _sort_name: 'asc',
        _sort_t_number: '', 
        _sort_price: ''
      
    initEvents: =>
      super
      @listenTo @collection, 'add remove reset change:price', =>
        @model.set _cnt : @collection.length + ' simulators'
        @model.set _sum : '$' + @collection.sumPrice()
        if @collection.length == 0
          console.log 'Üres a lista!'
          @notifierPub 'msg:show', 'Add new item!'
          @$('.graphModalBtn').hide()
        else
          @$('.graphModalBtn').show()
      
      @listenTo @collection, 'sort', => @render()


    initNotifierSub: =>
      @notifierSub 'simulator:add', (data) =>
        @collection.comparator = 'name'
        @collection.addItem data,
          error: (model,xhr,options) =>
            if xhr[0].code == 'error_req'
              @notifierPub 'msg:show', 'Connection Error!', 'error'
        $('input').val ''
        

      @notifierSub 'simulator:search', (data) =>
        @model.set search: data.name
        @fetchList()
    
    initModelDomBindings: =>
      @addModelDomBinding
        _cnt : '.nt-simulator-cnt'
        _sum : '.nt-simulator-sum'
        _sort_name : bindhelpers.class '[data-col=name]', (dir, val) => 
          @sortConv dir,val
        _sort_t_number : bindhelpers.class '[data-col=type_number]', (dir, val) => 
          @sortConv dir, val
        _sort_price : bindhelpers.class '[data-col=price]', (dir, val) =>
          @sortConv dir, val

    sortConv: (dir, val) =>
      if dir is 'ModelToView'
        if val then "nt-#{val}"

    initDomEvents : =>
      @addDomEvent
        'click .graphModalBtn': =>
          @createChild SimulatorPriceGraphView, collection: @collection
          , 'simulatorPriceGraphView'

        'click .nt-sort': (e) ->
          comp = $(e.target).closest('div').data 'col'
          
          if comp == 'name' && (@model.get '_sort_name') == ''
            @model.set _sort_name : 'desc', _sort_t_number : '', _sort_price : ''
            mod = '_sort_name'
          else if comp == 'type_number' && (@model.get '_sort_t_number') == ''
            @model.set _sort_t_number : 'desc', _sort_name : '', _sort_price : ''
            mod = '_sort_t_number'
          else if comp == 'price' && (@model.get '_sort_price') == ''
            @model.set _sort_price : 'desc', _sort_name : '', _sort_t_number : ''
            mod = '_sort_price'
          
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
            if comp == 'name' then @model.set _sort_name: 'desc'
            else if comp == 'type_number' then @model.set _sort_t_number: 'desc'
            else if comp == 'price' then @model.set _sort_price : 'desc'
          else if (@model.get mod) == 'desc'
            if comp == 'name' then @model.set _sort_name: 'asc'
            else if comp == 'type_number' then @model.set _sort_t_number: 'asc'
            else if comp == 'price' then @model.set _sort_price : 'asc'
    
    fetchList: =>
      @collection.fetch \
        reset: true, urlParams:search:@model.get('search')
