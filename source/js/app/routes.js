var Backbone = require('backbone');


var AppRoutes = Backbone.Router.extend({
  routes: {
    '': 'default',
    ':locale': 'locale:default',
    ':locale/:gender': 'locale:gender'
  }
});

module.exports = AppRoutes;
