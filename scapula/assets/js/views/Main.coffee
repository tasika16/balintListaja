define (require) ->
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

      searchView = @createChild SearchView

      simulatorListView = @createChild SimulatorListView,
        collection: simulatorList
      , 'simulatorList'

      simulatorAddView = @createChild SimulatorAddView

      searchView.$el.appendTo @$el
      simulatorListView.$el.appendTo @$el
      simulatorAddView.$el.appendTo @$el