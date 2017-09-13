define (require) ->
  _BaseViews = require '_BaseViews'
  tpl = require 'raw!../../templates/search.html'

  class SearchView extends _BaseViews.View
    className: 'nt-search'

    template: tpl
      