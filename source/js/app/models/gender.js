var Backbone = require('backbone');

var Gender = Backbone.Model.extend({
  defaults: {
    'current': false
  },
  initialize: function(){
    var _this = this;
    this.on('highlight', function(){
      _this.collection.forEach(function(m){
        m.set('current', false);
      });
      _this.set('current', true);
    });
  }
});

module.exports = Gender;
