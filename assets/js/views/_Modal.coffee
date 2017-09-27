define (require) ->
  _BaseViews = require '_BaseViews'
  _ = require 'underscore'
  class _ModalView extends _BaseViews.ParentView
    initDomEvents: =>
      @addDomEvent
        'hidemodal' : @hidden
        'bgclickmodal' : @hide

    hide: =>
      @$el.ntModal 'hide'
    
    hidden: =>
      @close()
    
    render: =>
      super
      $.ntForceBlur() unless $.ntIsMobile()
      @$el.ntModal _.extend
        show: true
        bodyShowClass: 'modal-open'
      , @options.modalOpts

    close: =>
      @$el.ntModal 'destroy' if @$el.data 'modal'
      super