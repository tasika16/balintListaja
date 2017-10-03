define (require) ->
  _BaseViews = require '_BaseViews'
  tpl = require 'raw!../../templates/search.html'
  bindhelpers = require 'bindhelpers'
  _BaseModels = require '_BaseModels'
  _ = require 'underscore'
  
  class SearchView extends _BaseViews.View
    className: 'nt-search'

    template: tpl

    initialize: =>
      @model = new _BaseModels.Model
      @modelBinderOpts = changeTriggers: '.search-inp':'input'
      @search = _.debounce @_search, 500

    initEvents: =>
      @listenTo @model, 'change:name', @search
          
    initModelDomBindings: =>
      @addModelDomBinding
        name: '.search-inp'

    _search: =>
      @notifierPub 'simulator:search', @model.toJSON()
