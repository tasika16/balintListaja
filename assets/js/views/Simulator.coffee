define (require) ->
  _BaseViews = require '_BaseViews'
  _BaseModels = require '_BaseModels'
  tpl = require 'raw!../../templates/simulator.html'
  bindhelpers = require 'bindhelpers'

  class SimulatorView extends _BaseViews.View
    className: 'nt-simulator'

    template: tpl

    initDomEvents: =>
      super
      @addDomEvent
        'click .nt-btn-del' : =>
          @model.destroy error: (model, resp) =>
            if resp[0].code == 'error_req'
              @notifierPub 'msg:show', 'Connection Error!', 'error'
    
    initModelDomBindings: =>
      @addModelDomBinding 
        name: bindhelpers.html '[data-col=name]'
        type_number: bindhelpers.html  '[data-col=type_number]'
        price: bindhelpers.html '[data-col=price]'