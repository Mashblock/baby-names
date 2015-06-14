window.$ = window.jQuery = require('jquery');
var Backbone = require('backbone'),
    Dropdown = require('bootstrap/js/dropdown'),
    fetchCache = require('backbone-fetch-cache');

Backbone.$ = $; // Marionette Browserify Fix

var App = require("./app/application");

$(document).on('ready', function(){
  if (!Modernizr.svg) return;
  App.start();
});

module.exports = App;
