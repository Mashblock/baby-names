var Backbone = require('backbone'),
    Mn = require("backbone.marionette"),
    AppRoutes = require('./routes'),
    LocaleCollection = require('./collections/locales'),
    GenderCollection = require('./collections/genders'),
    LayoutView = require('./views/layout'),
    LocaleView = require('./views/locales'),
    GenderView = require('./views/genders'),
    bind =  require('../utilities').bind;


var App = new Mn.Application({
  initialize: function(){
    this.locales = new LocaleCollection([{
      code: 'us', name: 'United States of America'
    },{
      code: 'nz', name: 'New Zealand', current: true
    },{
      code: 'gb_eng', name: 'England'
    }]);

    this.genders = new GenderCollection([{
      name: 'Boys', code: 'boy', color: '#04a', current: true
    },{
      name: 'Girls', code: 'girl', color: '#a04'
    }]);
  }
});

App.on('start', function(){
  this.layout = new LayoutView();
  this.layout.getRegion('genders')
    .show(new GenderView({collection: this.genders}));
  this.layout.getRegion('locales')
    .show(new LocaleView({collection:this.locales}));

});

App.on('start', function(){
  this.router = new AppRoutes();
  this.router.on('route:locale:default', bind(this.showLocale, this));
  this.router.on('route:locale:gender', bind(this.showGender, this));
  Backbone.history.start();
});

App.showLocale = function(locale_code){
  var current_gender = this.genders.findWhere({current: true}),
      path = locale_code+'/'+current_gender.get('code');
  this.router.navigate(path, {trigger: true, replace: true});
};

App.showGender = function(locale_code, gender_code) {
  this.locales.findWhere({code: locale_code})
    .trigger('highlight');
};

module.exports = App;
