var Mn = require('backbone.marionette');

var LocaleItem = Mn.ItemView.extend({
  template: '#locale_tmpl',
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

var LocaleCollection = Mn.CollectionView.extend({
  childView: LocaleItem,
  tagName: 'ul',
  className: 'list-inline'
});

module.exports = LocaleCollection;
