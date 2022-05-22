import * as d3 from "d3";

var svg = d3
  .select("#content")
  .append("svg")
  // .append("g")
  .attr("width", 800)
  .attr("height", 400);

// svg.append("svg:image")
// .attr('x', 70)
// .attr('y', 30)
// .attr('width', 655)
// .attr('opacity', 0.4)
// .attr("xlink:href", "https://states-of-america.ru/karty-ssha/karty/karta-shtatov-ssha.jpg")

//   .attr("viewBox", "100 450 200 200");

var tooltip = d3
  .select("#content")
  .append("div")
  .style("display", "block")
  .style("position", "absolute")
  .style("visibility", "hidden")
  .style("background-color", "rgba(255, 255, 255, 0.7)")
  .style("border", "solid")
  .style("border-width", "1px")
  .style("border-radius", "5px")
  .style("padding", "10px");

var state_div = d3
  .select("#content")
  .append("div")
  .style("height", "30px")
  .style("width", "100px")
  .style("text-align", "center")
  .style("font-size", "1.5em")
  .style("margin-top", "10px")
  .style("margin-left", "auto")
  .style("margin-right", "auto")
  .html("National");

var mouseover = function (d) {
  tooltip.style("visibility", "visible");

  d3.select(this).style("stroke", "black").style("opacity", 0.8);
};

var mouseleave = function (d) {
  tooltip.style("visibility", "hidden");

  d3.select(this).style("stroke", "grey").style("opacity", 0.6);
};

var mousemove = function (d) {
  var state_name = d.target.firstChild.nodeValue;

  tooltip
    .style("top", d.pageY + "px")
    .style("left", d.pageX + "px")
    .html(state_name);
};

var state_click = function (d) {
  var coords = d3.pointer(d);
  var state_name = d.target.firstChild.nodeValue;
  state_div.html(state_name);
  console.log(state_name, coords[0], coords[1]);
};
//
// d3.csv("https://raw.githubusercontent.com/KataevaVeronika/visualization/f2f32294d450b97f999308948755110830dbc240/crime_incarceration.csv", function(data) {
//   console.log(data);
// });

d3.csv(
  "https://raw.githubusercontent.com/Emidiant/crime-in-usa-visualisation/main/coordinates_extraction/state_coordinates/csv/polygon.csv",
  function (data) {
    // console.log(data.state)
    var state_name = data.state;
    var state_points = JSON.parse(data.new_coordinates);

    svg
      .append("polyline")
      .data(state_name)
      .text(data.state)
      .style("fill", "orange")
      .attr("stroke", "grey")
      .attr("opacity", 0.6)
      .attr("points", state_points)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("click", state_click)
      .on("mouseleave", mouseleave);
  }
);
