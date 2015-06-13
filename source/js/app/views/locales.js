var $ = require('jquery'),
    Mn = require('backbone.marionette');

var LocaleItem = Mn.ItemView.extend({
  template: '#locale_tmpl',
  tagName: 'li',
  events: {
    'click a': 'highlight'
  },

  highlight: function(e){
    e.preventDefault();
    this.model.trigger('highlight');
  }
});

var LocaleCollection = Mn.CompositeView.extend({
  childView: LocaleItem,
  childViewContainer: 'ul',
  template: '#locales_tmpl',
  collectionEvents: {
    highlight: 'onHighlight'
  },

  initialize: function(){
    this.model = this.collection.findWhere({current: true});
  },

  onHighlight: function(){
    this.model = this.collection.findWhere({current: true});
    this.render();
  },

  onRender: function(){
    $('.dropdown-toggle', this.el).dropdown()
  }
});

module.exports = LocaleCollection;
