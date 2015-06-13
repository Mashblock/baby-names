window.$ = window.jQuery = require('jquery');
var Backbone = require('backbone'),
    Dropdown = require('bootstrap/js/dropdown');

Backbone.$ = $; // Marionette Browserify Fix

var App = require("./app/application");

$(document).on('ready', function(){
  App.start();
});

module.exports = App;
