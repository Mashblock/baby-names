var Backbone = require('backbone'),
    Mn = require("backbone.marionette"),
    AppRoutes = require('./routes'),
    LocaleCollection = require('./collections/locales'),
    GenderCollection = require('./collections/genders'),
    ResultCollection = require('./collections/locale_gender_results'),
    LayoutView = require('./views/layout'),
    LocaleView = require('./views/locales'),
    GenderView = require('./views/genders'),
    GraphView = require('./views/graph'),
    bind = require('../utilities').bind;


var App = new Mn.Application({
  initialize: function(){
    this.locales = new LocaleCollection([{
      code: 'us', name: 'United States of America', current: true
    },{
      code: 'nz', name: 'New Zealand'
    },{
      code: 'gb_eng', name: 'England'
    }]);

    this.genders = new GenderCollection([{
      name: 'Boys', code: 'boy', color: '#04a', current: true
    },{
      name: 'Girls', code: 'girl', color: '#a04'
    }]);

    this.results = new ResultCollection();
  }
});

App.on('start', function(){
  this.layout = new LayoutView();
  this.layout.getRegion('genders')
    .show(new GenderView({collection: this.genders}));
  this.layout.getRegion('locales')
    .show(new LocaleView({collection:this.locales}));
  this.layout.getRegion('graph')
    .show(new GraphView({collection: this.results}));
});

App.on('start', function(){
  this.router = new AppRoutes();
  this.router.on('route:default', bind(this.updateData, this));
  Backbone.history.start();
});

App.on('start', function(){
  this.genders.on('highlight', bind(this.updateData, this));
  this.locales.on('highlight', bind(this.updateData, this));
});

App.updateData = function(){
  this.results.gender = this.genders.findWhere({current:true});
  this.results.locale = this.locales.findWhere({current:true});
  this.results.fetch();
};

App.showDefault = function(){
  this.locales.selectFromIPAddress();
};



module.exports = App;
