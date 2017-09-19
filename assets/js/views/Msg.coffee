define (require) ->
  _BaseViews = require '_BaseViews'
  tpl = require 'raw!../../templates/msg.html'

  class SimulatorAddView extends _BaseViews.View
    className: 'connection-error'

    template: tpl

    initNotifierSub: =>
      @notifierSub 'msg:show' : (msg, status) =>
        if status == 'error'
          @$('.msg').addClass('fa fa-plug fa-2x .cstm-er-co')
        else if status == 'success'
          @$('.msg').addClass('fa fa-check fa-2x cstm-sccs-co')
        console.log msg
        @$('.msg').show('').children('.msgIcon').html msg
      
      @notifierSub 'msg:hide' : (h_time = 5000) =>
        clearTimeout @_errTimer
        @_errTimer = setTimeout (->
          @$('.msg').hide('')  
          return
          ),h_time 
    
    beforeClose: =>
      clearTimeout @_errTimer
