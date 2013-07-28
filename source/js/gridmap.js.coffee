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

    @leftNames = @svg.append("g")
      .attr("class", "left-text")
      .attr("transform", "translate(90, #{@top_margin})")

    @rightNames = @svg.append("g")
      .attr("class", "right-text")
      .attr("transform", "translate(#{@width-90},#{@top_margin})")

    @grid = @svg.append("g")
      .attr("class", "grid")
      .attr("transform", "translate(100,#{@top_margin})")

    _(App.years).each (year, index)=>
      @grid.append("g")
        .attr("data-year", year)
        .attr("transform", "translate(#{index*@block_width}, 0)")

  updateData: (@data, @color='#000')->
    @svg.attr "height", (@data.length*@block_height) + @top_margin
    @shade = d3.scale.linear().range(["#fff", @color])

    left_text = @leftNames.selectAll("text")
      .data(@data, (d)-> d.name)

    left_text.enter().append("text")
    left_text.exit().remove()

    left_text.text((d)-> d.name)
      .attr("y", (d,i)=> (i+0.5)*@block_height)
      .style("fill", @color)

    right_text = @rightNames.selectAll("text")
      .data(@data, (d)-> d.name)

    right_text.enter().append("text")
    right_text.exit().remove()

    right_text.text((d)-> d.name)
      .attr("y", (d,i)=> (i+0.5)*@block_height)
      .style("fill", @color)


    _(App.years).each (year, index)=>
      @shade.domain d3.extent(_(@data).collect((d)-> d[year]?.number))
      group = d3.select("[data-year='#{year}']").selectAll("g")
        .data(@data, (d)-> d.name)

      new_group = group.enter().append("g")
      new_group.append("rect")
      new_group.append("title")
      new_group.append("text").attr("class","rank_status")


      group.exit().remove()

      group.attr("transform",  (d,i)=> "translate(0, #{@block_height*i})")
      group.select("rect")
        .attr("height",@block_height)
        .attr("width", @block_width)
        .style("fill", (d)=> if d[year]? then @shade(d[year].number) else "#fff")
      group.select("title").text((d)=> @tooltip(d, year))
      group.select("text.rank_status")
        .text((d)=> if d[year]?.rank == 1 then "★" else "" )
        .attr("x", (d)=> @block_width/2)
        .attr("y", (d)=> @block_height/2)



  tooltip: (d, year)->
    description = if d[year]? then "Rank: #{d[year].rank} - Number: #{d[year].number}" else "Outside top 100"
    "#{year} - #{description}"

