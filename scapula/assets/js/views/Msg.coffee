define (require) ->
  _BaseViews = require '_BaseViews'
  tpl = require 'raw!../../templates/msg.html'

  class SimulatorAddView extends _BaseViews.View
    className: 'connection-error'

    template: tpl

    initNotifierSub: =>
      @notifierSub 'msg:show' : (msg, status) =>
        if status == 'error'
          @$('.msg')
            .addClass('fa fa-plug fa-2x')
            .css("background-color","#FFBABA")
            .css('color','#D8000C') 
        else if status == 'success'
          @$('.msg')
          .addClass('fa fa-check fa-2x')
          .css('background-color','#DFF2BF')
          .css('color','#4F8A10')
        console.log msg
        @$('.msg').show('').children('.msgIcon').html msg
      
      @notifierSub 'msg:hide' : (h_time) =>
        setTimeout (->
          @$('.msg').hide('')  
          return
          ),h_time 
        
