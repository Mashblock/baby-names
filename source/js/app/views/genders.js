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

  templateHelpers: {
    buttonClass: function(){
      var class_name = this.code;
      if (this.current) class_name += ' active';
      return class_name;
    }
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
