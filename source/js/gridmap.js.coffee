class window.Gridmap
  block_height: 20
  top_margin: 20
  tooltip: _.template """
      <strong>Rank:</strong> <%= rank %><br />
      <strong>Number:</strong> <%= number %><br />
  """

  constructor: (@element)->

    @svg = d3.select(@element).append("svg")

    @yearTitles = @svg.append("g")
      .attr("class", "year-title")
      .attr("transform", "translate(100,0)")
    @yearTitles.selectAll("text")
      .data(App.years)
      .enter().append("text")
    @width_scale = d3.scale.ordinal().domain(App.years)

    @paper = @svg.append("g")

    $(window).on "snap", @setMedia
    $(window).on "resize", @onResize
    $(window).trigger("resize")

  setMedia: (e,data)=>
    @media = switch data.minWidth
      when 0 then "xs"
      when 768 then "sm"
      when 992 then "md"
      when 1200 then "lg"
    @svg.attr("data-media", @media)

  onResize: =>
    if @media == "xs" || @previous_media != @media
      @redraw()
      @previous_media = @media

  setShades: ->
    @shades = {}
    @year_data = d3.nest().key((d)-> d.year).entries(@data)
    @year_data.forEach (year)=>
      @shades[year.key] = d3.scale.linear()
        .range(["#fff", @color])
        .domain d3.extent(_(year.values).collect((d)-> parseInt(d.number, 10)))

  redraw: ->
    @width = parseInt(d3.select(@element).style('width'),10)

    top_margin = if @media == "xs" then 40 else 20

    @svg.attr("width",@width)
    @paper.attr("transform", "translate(0,#{top_margin})")

    grid_width =  if @media == 'xs' then (@width-120) else (@width-200)
    @width_scale.rangeRoundBands([0, grid_width], 0)


    @yearTitles.selectAll("text")
      .text((d)-> d)

    rows = @paper.selectAll("g.row")
    rows.attr("transform", (d,i)=> "translate(0, #{i*@block_height})")
    rows.selectAll("text.left-text")
      .text((d)-> d.key)
      .style("fill", @color)
      .attr("y", @block_height/2)
      .attr("transform", "translate(90, 0)")

    rows.selectAll("text.right-text")
      .text((d)-> d.key)
      .style("fill", @color)
      .attr("y", @block_height/2)
      .attr("transform", "translate(#{@width-90},0)")

    cells = rows.selectAll("g.cell")
    cells.attr("transform",(d)=> "translate(#{@width_scale(d.key) + 100},0)")
      .attr("data-toggle", "popover")
      .attr("data-trigger", "hover")
      .attr("data-container", "body")
      .attr("data-placement", "top")
      .attr("data-html", "true")
      .attr("data-title", (d)=> "#{d.values[0].name} - #{d.values[0].year}")
      .attr("data-content", (d)=> @tooltip(d.values[0]))

    cells.selectAll("rect")
      .attr("height",@block_height)
      .attr("width", @width_scale.rangeBand())
      .style("fill", (d)=> @shades[d.key](d.values[0].number))

    cells.selectAll("text.rank_status")
      .text((d)=> if parseInt(d.values[0].rank,10) == 1 then "★" else "" )
      .attr("x", @width_scale.rangeBand()/2.0)
      .attr("y", @block_height/2.0)

    $("[data-toggle=popover]").popover()

    if @media == "xs"
      rows.selectAll("text.right-text")
        .style("visibility", "hidden")
      @yearTitles.selectAll("text")
        .attr("transform",(d)=> "translate(#{@width_scale(d) + (@width_scale.rangeBand()/2.0)}, 20)rotate(90)")
        .style("dominant-baseline", "middle")
    else
      rows.selectAll("text.right-text")
        .style("visibility", "visible")
      @yearTitles.selectAll("text")
        .attr("transform",(d)=> "translate(#{@width_scale(d) + (@width_scale.rangeBand()/2.0)}, 0)")
        .style("dominant-baseline", "hanging")


  updateData: (@data, @color='#000')->
    @setShades()

    grouped_data = d3.nest()
      .key((d)-> d.name).sortKeys(d3.ascending)
      .key((d)-> d.year).sortKeys(d3.ascending)
      .entries(@data)
    @svg.attr "height", (grouped_data.length*@block_height) + @top_margin

    rows = @paper.selectAll("g.row")
      .data(grouped_data, (d)-> d.key)

    new_row = rows.enter().append("g").attr("class", "row")
    new_row.append("text")
      .attr("class", "left-text")
    new_row.append("text")
      .attr("class", "right-text")

    rows.exit().remove()

    cells = rows.selectAll("g.cell")
      .data ((d)-> d.values), ((d)-> d.key)

    new_cells = cells.enter()
      .append("g").attr("class","cell")
    new_cells.append("rect")
    new_cells.append("text").attr("class", "rank_status")

    cells.exit().remove()

    @redraw()



