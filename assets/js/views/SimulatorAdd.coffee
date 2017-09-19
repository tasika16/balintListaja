define (require) ->
  _BaseViews = require '_BaseViews'
  tpl = require 'raw!../../templates/simulator_add.html'
  bindhelpers = require 'bindhelpers'
  Simulator = require 'models/Simulator'

  class SimulatorAddView extends _BaseViews.View
    className: 'nt-simulator-add'

    template: tpl

    initialize: =>
      @model = new Simulator

    initEvents: =>
      @listenTo @model, 'invalid', (err_msg) =>
        handleError err_msg.validationError

    initDomEvents: =>
      @addDomEvent
        'click .simulator-add-btn': =>
          ###@notifierPub 'simulator:add', simulator
            @notifierPub 'msg:show', 'The add was succesfully!', 'success'
            @$('.input').val('');
            @notifierPub 'msg:hide', 5000
            ###
          if @model.isValid(isEmpty: true)
            @notifierPub 'simulator:add', @model.toJSON()

        'keypress .input': =>
          $('.custom-error').hide('')    

    initModelDomBindings: =>
      #@modelBinderOpts = modelSetOptions: validate: true
      @addModelDomBinding
        name: '.simulator-name-inp'
        type_number: '.simulator-type-number-inp'
        price: '.simulator-price-inp'

    handleError = (msg) => 
      $('.custom-error').show('')
      .children('.fa-times-circle').html(msg)
    