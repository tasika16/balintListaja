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

      @createChild(SearchView, {}, 'search').$el.appendTo @$el

      simulatorListView = @createChild SimulatorListView, {}
      , 'simulatorList'

      simulatorListView.fetchList()

      simulatorListView.$el.appendTo @$el

      @createChild(SimulatorAddView, {}, 'simulatorAdd').$el.appendTo @$el