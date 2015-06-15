var Mn = require('backbone.marionette');

var Layout = Mn.LayoutView.extend({
  el: 'body',
  regions: {
    locales: '#locales',
    genders: '#genders',
    graph: '#graph'
  }
});

module.exports = Layout;
