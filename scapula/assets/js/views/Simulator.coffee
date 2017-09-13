define (require) ->
  _BaseViews = require '_BaseViews'
  tpl = require 'raw!../../templates/simulator.html'

  class SimulatorView extends _BaseViews.View
    className: 'nt-simulator'

    template: tpl

    initDomEvents: =>
      super
      @addDomEvent
        'click .nt-btn-del' : =>
          # @model.destroy()
          @model.collection.remove @model