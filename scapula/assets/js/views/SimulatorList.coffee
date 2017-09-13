define (require) ->
  _BaseViews = require '_BaseViews'
  tpl = require 'raw!../../templates/simulator_list.html'

  SimulatorView = require 'views/Simulator'

  class SimulatorListView extends _BaseViews.CollectionView
    className: 'nt-simulator-list'

    template: tpl

    ItemView: SimulatorView

    itemCont: '.nt-simulator-list-cont'

    initNotifierSub: =>
      @notifierSub 'simulator:add', (data) =>
        console.log 'name: ', data.attributes.name
        @collection.add data
      