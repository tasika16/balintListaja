define (require) ->
  _BaseViews = require '_BaseViews'
  tpl = require 'raw!../../templates/msg.html'
  _BaseModels = require '_BaseModels'
  bindhelpers = require 'bindhelpers'

  class MsgView extends _BaseViews.View
    className: 'msg'

    template: tpl

    initialize: =>
      @model = new _BaseModels.Model()

    initNotifierSub: =>
      @notifierSub 'msg:show', (msg, status = 'success') =>
        @model.set _type: status
        console.log msg
        @$('.msg').show('').children('.msgIcon').html msg
        @notifierPub 'msg:hide'
      
      @notifierSub 'msg:hide', (h_time = 5000) =>
        clearTimeout @_msgTimer
        @_msgTimer = setTimeout ->
          @$('.msg').hide ''  
        , h_time 
    
    initModelDomBindings: =>
      @addModelDomBinding
        _type : bindhelpers.class '.msg', (dir, val) ->
          if dir is 'ModelToView'
            if val then "cstm-#{val}-co" else ''

    beforeClose: =>
      clearTimeout @_msgTimer
