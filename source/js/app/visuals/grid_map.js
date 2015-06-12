var d3 = require('d3');

class GridMap {
  constructor(element, collection){
    this.element = element;
    this.collection = collection;
  }

  render(){
    this.element.innerHTML = '<pre>' + JSON.stringify(this.collection.toJSON(), null, '  ') + '</pre>';
  }
}

module.exports = GridMap;
