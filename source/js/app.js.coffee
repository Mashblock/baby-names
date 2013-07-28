#= require gridmap

top.location.replace(self.location.href) if (top != self)

window.App =
  years: [1999..2012]
  data: {}
  colors:
    girls: "#a04"
    boys: "#04a"
$(document).ready ->
  App.gridmap = new Gridmap(document.getElementById("graph"))
  App.showSex("boys")
  $("#genders a").click ->
    App.showSex($(this).data("gender"))
    false

App.showSex = (sex)->
  $("#genders li").removeClass("active")
  $("#genders li.#{sex}").addClass("active")
  color = App.colors[sex]
  if App.data[sex]
    App.gridmap.updateData(App.data[sex], color)
  else
    d3.csv("data/#{sex}.csv").get (error, rows)->
      tmp_data = {}
      _(rows).forEach (row)->
        tmp_data[row.name] ?= {}
        tmp_data[row.name][parseInt(row.year)] = {number: parseInt(row.number), rank: parseInt(row.rank)}
      App.data[sex] = _(tmp_data).chain()
        .collect((values, key)-> _(values).extend({name: key}))
        .sortBy((girl)-> girl.name)
        .value()
      App.gridmap.updateData(App.data[sex], color)



