var d3 = require('d3'),
    _ = require('underscore'),
    utilities = require('../../utilities');

var bind = utilities.bind,
    media = utilities.media;

var template = _.template("<strong>Rank:</strong> <%= rank %><br /><strong>Number:</strong> <%= number.toLocaleString() %><br />");

class GridMap {
  constructor(element, collection){
    this.block_height = 20;
    this.top_margin = 40;

    this.element = element;
    this.collection = collection;

    this.x_scale = d3.scale.ordinal();

    this.svg = d3.select(this.element).append('svg');
    this.paper = this.svg.append("g");
    this.paper.attr("transform", `translate(0,${this.top_margin})`);

    this.year_titles = this.svg.append("g")
      .attr("class", "year-title")
      .attr("transform", `translate(100,${this.top_margin - 5})`);

    d3.select(window).on('resize', _.throttle(bind(this.reposition, this), 300));
  }

  render(){
    if (this.collection.length == 0) return;

    this.current_years = _.unique(this.collection.pluck('year')).sort((a,b)=> a-b);

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

    this.reposition();
  }

  reposition(){
    this.width = parseInt(d3.select(this.element).style('width'),10);
    this.svg.attr('width', this.width);

    this.media = media();

    this.grid_width = this.width - 100;
    if (this.media != 'xs') this.grid_width -= 100;

    this.x_scale.domain(this.current_years).rangeRoundBands([0, this.grid_width], 0);
    this.year_titles.call(bind(this.drawColumnTitles, this));

    this.paper.selectAll('text.right-text')
      .style('visibility', (this.media == 'xs') ? 'hidden' : 'visible')
      .attr("transform", `translate(${this.width-180},0)`);

    var cells = this.paper.selectAll('g.cell')
      .attr('transform', (d)=> `translate(${this.x_scale(d.get('year'))}, 0)`);
    cells.selectAll('text.rank_status')
      .attr("x", this.x_scale.rangeBand()/2.0);
    cells.selectAll('rect')
      .attr('width', this.x_scale.rangeBand())
  }

  drawColumnTitles(selection){
    var _this = this;
    var columns = selection.selectAll("text")
      .data(this.current_years)

    columns.enter().append("text");
    columns.exit().remove();
    columns.text((d)=> d)
      .attr("transform", function(d){
        var transform = `translate(${_this.x_scale(d) + (_this.x_scale.rangeBand()/2.0)}, 0)`
        if (_this.media == 'xs') transform += 'rotate(90)';
        return transform;
      });
  }

  drawRows(selection){
    var new_row = selection.enter().append('g')
      .attr('class', 'rows');

    new_row.append('text').attr('class','left-text')
      .attr("transform", "translate(-10, 0)");

    new_row.append('text').attr('class','right-text');

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
    new_cells.append('text').attr('class', 'rank_status')

    selection.exit().remove();

    selection.attr("data-toggle", "popover")
      .attr("data-trigger", "hover")
      .attr("data-container", "body")
      .attr("data-placement", "top")
      .attr("data-html", "true")
      .attr("data-title", (d)=> `${d.get('name')} - ${d.get('year')}`)
      .attr("data-content", (d)=> template(d.attributes) )

    selection.selectAll('text.rank_status')
      .text((d)=> (d.get('rank') == 1) ? "★" : "" )
      .attr("y", this.block_height/2.0);

    selection.selectAll('rect')
      .attr('height', this.block_height)
      .style('fill', function(d){
        var color_scale = _this.shades[d.get('year')];
        return color_scale(d.get('number'));
      });

    $("[data-toggle=popover]", this.element).popover()
  }
}

module.exports = GridMap;
