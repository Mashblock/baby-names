class window.Gridmap
  width: 940
  block_height: 20
  top_margin: 20


  constructor: (@element)->
    @svg = d3.select(@element).append("svg")
      .attr("width",@width)
    @block_width = (@width-200)/App.years.length

    @yearTitles = @svg.append("g")
      .attr("class", "year-title")
      .attr("transform", "translate(100,0)")
    @yearTitles.selectAll("text")
      .data(App.years)
      .enter().append("text")
      .text((d)-> d)
      .attr("x", (d,i)=> (i+0.5)*@block_width)

    @paper = @svg.append("g").attr("transform", "translate(0,#{@top_margin})")


  updateData: (@data, @color='#000')->
    @svg.attr "height", (@data.length*@block_height) + @top_margin
    @shades = {}
    _(App.years).each (year, index)=>
      @shades[year] = d3.scale.linear()
        .range(["#fff", @color])
        .domain d3.extent(_(@data).collect((d)-> d[year]?.number))

    rows = @paper.selectAll("g.row")
      .data(@data, (d)-> d.name)

    new_row = rows.enter().append("g").attr("class", "row")
    new_row.append("text")
      .attr("class", "left-text")
      .attr("y", @block_height/2)
      .attr("transform", "translate(90, 0)")
    new_row.append("text")
      .attr("class", "right-text")
      .attr("y", @block_height/2)
      .attr("transform", "translate(#{@width-90},0)")

    _(App.years).each (year, index)=>
      cell = new_row.append("g")
        .attr("data-year", year)
        .attr("transform", "translate(#{(@block_width*index) + 100},0)")
      cell.append("rect")
        .attr("height",@block_height)
        .attr("width", @block_width)
      cell.append("title")
      cell.append("text")
        .attr("class","rank_status")
        .attr("x", (d)=> @block_width/2)
        .attr("y", (d)=> @block_height/2)

    rows.exit().remove()

    rows.attr("transform", (d,i)=> "translate(0, #{i*@block_height})")

    rows.select("text.left-text")
      .text((d)-> d.name)
      .style("fill", @color)

    rows.select("text.right-text")
      .text((d)-> d.name)
      .style("fill", @color)

    _(App.years).each (year, index)=>
      cell = rows.selectAll("g[data-year='#{year}']")
      cell.selectAll("rect")
        .style("fill", (d)=> if d[year]? then @shades[year](d[year].number) else "#fff")
      cell.selectAll("title").text((d)=> @tooltip(d, year))
      cell.selectAll("text.rank_status")
        .text((d)=> if d[year]?.rank == 1 then "★" else "" )


  tooltip: (d, year)->
    description = if d[year]? then "Rank: #{d[year].rank} - Number: #{d[year].number}" else "Outside top 100"
    "#{year} - #{description}"

