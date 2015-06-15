var Backbone = require('backbone'),
    GridMap = require('../visuals/grid_map');

var GraphView = Backbone.View.extend({
  initialize: function(){
    this.grid_map = new GridMap(this.el, this.collection);
    this.collection.on('sync', this.render, this);
  },
  render: function(){
    this.grid_map.render();
  }
});

module.exports = GraphView;
