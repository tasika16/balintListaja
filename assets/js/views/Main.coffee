define (require) ->
  _ = require 'underscore'
  _BaseViews = require '_BaseViews'

  SimulatorList = require 'collections/SimulatorList'
  SimulatorListView = require 'views/SimulatorList'
  SearchView = require 'views/Search'
  SimulatorAddView = require 'views/SimulatorAdd'

  class MainView extends _BaseViews.ParentView
    template: require 'raw!../../templates/main.html'

    afterRender: =>
      simulatorList = new SimulatorList [
        name: 'Alma'
        type_number: 'A1000'
        price: 25000
      ,
        name: 'Barack'
        type_number: 'B1000'
        price: 25000
      ]

      @createChild(SearchView, {}, 'search').$el.appendTo @$el

      simulatorListView = @createChild SimulatorListView,
        collection: simulatorList
      , 'simulatorList'

      simulatorListView.$el.appendTo @$el

      @createChild(SimulatorAddView, {}, 'simulatorAdd').$el.appendTo @$el