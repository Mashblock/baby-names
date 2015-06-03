var Backbone = require('backbone');

var Result = Backbone.Model.extend({
  idAttribute: '_id',
  parse: function(response){
    return response.value;
  }
});

module.exports = Result;
