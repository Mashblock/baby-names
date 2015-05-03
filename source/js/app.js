var Mn = require("backbone.marionette"),
    LocaleCollection = require('./app/collections/locales');

var App = new Mn.Application();

App.config = {
  colors: {
    girls: "#a04",
    boys: "#04a"
  }
};

App.on('start', function(){
  this.locales = new LocaleCollection([{
    code: 'nz',
    name: 'New Zealand'
  },{
    code: 'us',
    name: 'United States of America'
  },{
    code: 'gb_eng',
    name: 'England'
  }]);
  console.log(this.locales);
});

module.exports = App;
