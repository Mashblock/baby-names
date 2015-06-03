var $ = require('jquery'),
    Backbone = require('backbone'),
    Locale = require('../models/locale'),
    bind = require('../../utilities').bind;

var Locales = Backbone.Collection.extend({
  model: Locale,

  selectFromIPAddress: function(){
    var _this = this;
    $.getJSON('http://freegeoip.net/json/?callback=?', function(data){
      var code = data.country_code.toLowerCase(),
          locale;
      switch (code) {
        case 'gb':
          locale = _this.findWhere({code: 'gb_eng'});
          break;
        default:
          locale = _this.findWhere({code: code});
          break;
      }
      if (typeof locale == 'undefined') locale = _this.findWhere({code: 'us'});
      locale.trigger('highlight');
    });
  }
});

module.exports = Locales;
