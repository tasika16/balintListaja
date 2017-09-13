define (require) ->
  _BaseViews = require '_BaseViews'
  tpl = require 'raw!../../templates/simulator_add.html'

  Simulator = require 'models/Simulator'

  class SimulatorAddView extends _BaseViews.View
    className: 'nt-simulator-add'

    template: tpl

    initDomEvents: =>
      @addDomEvent
        'click .simulator-add-btn': =>
          simulator = new Simulator 
            name: @$('.simulator-name-inp').val()
            type_number: @$('.simulator-type-number-inp').val()
            price: @$('.simulator-price-inp').val()

          if simulator.attributes.name == '' || 
             simulator.attributes.type_number == '' || 
             simulator.attributes.price == ''
            handleError 'Please fill every field!'
          else if !(Number.isInteger parseInt simulator.attributes.price)
            handleError 'Please fill the price field just number!'
          else
            @notifierPub 'simulator:add', simulator
            @notifierPub 'msg:show', 'The add was succesfully!', 'success'
            @$('.input').val('');
            @notifierPub 'msg:hide', 5000

      @addDomEvent
        'keypress .input': =>
          $('.custom-error').hide('')

    handleError = (msg) =>
      console.log msg 
      $('.custom-error').show('')
      .children('.fa-times-circle').html(msg)
    