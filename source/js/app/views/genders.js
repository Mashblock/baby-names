var Mn = require('backbone.marionette');

var GenderItem = Mn.ItemView.extend({
  template: '#gender_tmpl',
  tagName: 'li',
  events: {
    'click a': 'highlight'
  },

  modelEvents: {
    'change': 'render'
  },

  highlight: function(e){
    e.preventDefault();
    this.model.trigger('highlight');
  }
});

var GenderCollection = Mn.CollectionView.extend({
  childView: GenderItem,
  tagName: 'ul',
  className: 'list-inline'
});

module.exports = GenderCollection;
