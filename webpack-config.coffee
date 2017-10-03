path = require 'path'
webpack = require 'webpack'

module.exports =
  entry: './assets/js/app'

  output:
    path: 'public'
    filename: 'js/bundle.js'

  module:
    loaders: [
      test: /\.coffee$/
      loader: 'coffee'
    ]

  resolveLoader:
    modulesDirectories: [
      'node_modules'
      path.join(__dirname, 'node_modules')
    ]

  resolve:
    alias:
      jquery: 'jquery/dist/jquery.js'
      handlebars: 'handlebars/dist/handlebars.js'
      modelbinder: 'backbone.modelbinder'
      jquerynt: 'jquery-nt'
      base64: 'base64-js'
      date: 'datejs'
    modulesDirectories: [
      'js'
      'node_modules'
      'node_modules/scapula/src'
      path.join(__dirname, 'node_modules')
    ]
    extensions: [
      ''
      '.coffee'
      '.js'
    ]

  plugins: [
    new webpack.ProvidePlugin
      $: 'jquery'
      jQuery: 'jquery'
  ]