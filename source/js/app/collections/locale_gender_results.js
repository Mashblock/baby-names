var $ = require('jquery'),
    Backbone = require('backbone'),
    Result = require('../models/result');

var LocaleGenderResults = Backbone.Collection.extend({
  model: Result,
  fetch: function(){
    var _this = this,
        dbview = "http://mashblock.iriscouch.com/babynames/_design/names/_view/by_locale_gender";

    $.getJSON( dbview, {
        key: JSON.stringify([this.locale.get('code'), this.gender.get('code')])
      }).done(function(results){
        _this.set(results.rows, {parse: true});
        console.log(_this);
      });
  }
});

module.exports = LocaleGenderResults;
