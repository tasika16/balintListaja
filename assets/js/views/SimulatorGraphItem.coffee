define (require) ->
  _BaseViews = require '_BaseViews'
  tpl = require 'raw!../../templates/simulator_graph_item.html'

  class SimulatorGraphItemView extends _BaseViews.View
    className: 'nt-graph-item'

    template: tpl

    initTplVars: =>
      @addTplVar
        max_price: 25000
    