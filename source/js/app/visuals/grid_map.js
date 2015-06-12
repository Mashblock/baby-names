var d3 = require('d3'),
    _ = require('underscore'),
    bind = require('../../utilities').bind;

class GridMap {
  constructor(element, collection){
    this.block_height = 20;
    this.top_margin = 20;

    this.element = element;
    this.collection = collection;

    this.x_scale = d3.scale.ordinal();

    this.svg = d3.select(this.element).append('svg');
    this.paper = this.svg.append("g");
    this.paper.attr("transform", `translate(0,${this.top_margin})`);

    this.year_titles = this.svg.append("g")
      .attr("class", "year-title")
      .attr("transform", "translate(100,0)");
  }

  render(){
    if (this.collection.length == 0) return;
    this.width = parseInt(d3.select(this.element).style('width'),10);
    this.svg.attr('width', this.width);

    this.current_years = _.unique(this.collection.pluck('year')).sort((a,b)=> a-b);
    this.x_scale.domain(this.current_years).rangeRoundBands([0, this.width - 200], 0);
    this.year_titles.call(bind(this.drawColumnTitles, this));

    this.color = this.collection.gender.get('color');
    this.shades = {};

    this.current_years.forEach(function(y){
      var values = this.collection.where({year: y})
        .map((d)=> d.get('number'));

      this.shades[y] = d3.scale.linear()
        .range(["#fff", this.color])
        .domain(d3.extent(values));
    }, this)

    var grouped_data = d3.nest()
      .key((d)=> d.get('name')).sortKeys(d3.ascending)
      .entries(this.collection.models);

    this.svg.attr( "height", (grouped_data.length*this.block_height) + this.top_margin);

    this.paper.selectAll('g.rows')
      .data(grouped_data, (d)=> d.key )
      .call(bind(this.drawRows, this));
  }

  drawColumnTitles(selection){
    var columns = selection.selectAll("text")
      .data(this.current_years)

    columns.enter().append("text");
    columns.exit().remove();
    columns.text((d)=> d)
      .attr("transform",(d)=> `translate(${this.x_scale(d) + (this.x_scale.rangeBand()/2.0)}, 0)`)
      .style("dominant-baseline", "hanging");
  }

  drawRows(selection){
    var new_row = selection.enter().append('g')
      .attr('class', 'rows');

    new_row.append('text').attr('class','left-text')
      .attr("transform", "translate(-10, 0)");

    new_row.append('text').attr('class','right-text')
      .attr("transform", `translate(${this.width-180},0)`);

    selection.exit().remove();

    selection.attr('transform', (d, i)=> `translate(100, ${i*this.block_height})`);

    selection.selectAll('text')
      .style('fill', this.color)
      .attr("y", this.block_height/2)
      .text((d)=> d.key );

    selection.selectAll('g.cell')
      .data(((d)=> d.values), ((d)=> d.id ))
      .call(bind(this.drawCells, this));
  }

  drawCells(selection){
    var _this = this;
    var new_cells = selection.enter().append('g')
      .attr('class', 'cell');

    new_cells.append('rect');
    new_cells.append('title');
    new_cells.append('text').attr('class', 'rank_status')

    selection.exit().remove();

    selection.attr('transform', (d)=> `translate(${this.x_scale(d.get('year'))}, 0)`)

    selection.selectAll('title')
      .text((d)=> `Year: ${d.get('year')}\nNumber: ${d.get('number')}\nRank: ${d.get('rank')}`)

    selection.selectAll('text.rank_status')
      .text((d)=> (d.get('rank') == 1) ? "★" : "" )
      .attr("x", this.x_scale.rangeBand()/2.0)
      .attr("y", this.block_height/2.0);

    selection.selectAll('rect')
      .attr('width', this.x_scale.rangeBand())
      .attr('height', this.block_height)
      .style('fill', function(d){
        var color_scale = _this.shades[d.get('year')];
        return color_scale(d.get('number'));
      });
  }
}

module.exports = GridMap;
