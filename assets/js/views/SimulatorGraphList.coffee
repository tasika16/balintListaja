define (require) ->
  _BaseViews = require '_BaseViews'
  _BaseModels = require '_BaseModels'
  tpl = require 'raw!../../templates/simulator_graph_list.html'
  SimulatorListCollection = require 'collections/SimulatorList'
  SimulatorGraphItemView = require 'views/SimulatorGraphItem'

  class SimulatorGraphListView extends _BaseViews.CollectionView
    className: 'nt-graph-list'

    template: tpl

    ItemView: SimulatorGraphItemView

    itemCont: '.nt-simulator-graph-list-cont'

    maxPrice: =>
      maximum = @collection.max (m) -> m.get 'price'
