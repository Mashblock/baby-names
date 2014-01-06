#= require gridmap

top.location.replace(self.location.href) if (top != self)

window.App =
  years: [1999..2013]
  data: {}
  colors:
    girls: "#a04"
    boys: "#04a"
$(document).ready ->
  if Modernizr.svg
    App.gridmap = new Gridmap(document.getElementById("graph"))
    App.showSex("boys")
    $("#genders a").click ->
      App.showSex($(this).data("gender"))
      false
    $.rubberband
      minWidth: [768, 992, 1200]

App.showSex = (sex)->
  NProgress.start()
  $("#genders li").removeClass("active")
  $("#genders li.#{sex}").addClass("active")
  color = App.colors[sex]
  App.gridmap.updateData([], color)
  if App.data[sex]
    App.gridmap.updateData(App.data[sex], color)
    NProgress.done()
  else
    d3.csv("data/#{sex}.csv").get (error, rows)->
      App.data[sex] = rows
      App.gridmap.updateData(App.data[sex], color)
      NProgress.done()




