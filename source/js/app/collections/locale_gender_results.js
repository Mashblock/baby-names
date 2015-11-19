var $ = require('jquery'),
    Backbone = require('backbone'),
    Result = require('../models/result');

var LocaleGenderResults = Backbone.Collection.extend({
  model: Result,
  url: function(){
    var endpoint = "http://mashblock.cloudant.com/babynames/_design/names/_view/by_locale_gender",
        params = $.param({
          key: JSON.stringify([this.locale.get('code'), this.gender.get('code')])
        });
    return endpoint + "?" + params;
  },
  parse: function(response){
    return response.rows;
  }
});

module.exports = LocaleGenderResults;
