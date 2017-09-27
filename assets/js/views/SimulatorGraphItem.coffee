define (require) ->
  _BaseViews = require '_BaseViews'
  _BaseModels = require '_BaseModels'
  tpl = require 'raw!../../templates/simulator_graph_item.html'

  class SimulatorGraphItemView extends _BaseViews.View
    className: 'nt-graph-item'

    template: tpl
