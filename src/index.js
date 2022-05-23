// import * as d3 from "d3";
// sliderHorizontal, sliderVertical, sliderTop, sliderRight, sliderBottom, sliderLeft
import { sliderBottom } from "d3-simple-slider";

var title = d3
  .select("#content")
  .append("div")
  .style("height", "30px")
  .style("width", "300px")
  .style("text-align", "center")
  .style("font-size", "1.8em")
  .style("margin-left", "auto")
  .style("margin-right", "auto")
  .html("Crime in United States");

var svg = d3
  .select("#content")
  .append("svg")
  // .style("border-radius", "15px")
  // .append("g")
  .attr("width", 800)
  .attr("height", 400);

// svg.append("svg:image")
// .attr('x', 70)
// .attr('y', 30)
// .attr('width', 655)
// .attr('opacity', 0.4)
// .attr("xlink:href", "https://states-of-america.ru/karty-ssha/karty/karta-shtatov-ssha.jpg")

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

// <input type="range" name="mySlider" id=mySlider min="2" max="40" value="10">

// var slider = d3.select("#content")
//   .append("input")
//   .attr("type", "range")
//   .attr("name", "year_slider")
//   .attr("id", "yearSlider")
//   .attr("min", 2)
//   .attr("max", 40)
//   .attr("value", 10)
//   .style("display", "block")
//   .style("margin-top", "20px")
//   .style("margin-left", "auto")
//   .style("margin-right", "auto")
//   .style("width", "700px");

const slider = sliderBottom()
  .min(2004)
  .max(2017)
  .step(1)
  .width(700)
  .displayFormat(d3.format(".0f"))
  .tickFormat(d3.format(".0f"));

const g = d3
  .select("#content")
  .append("svg")
  .attr("class", "#mySlider")
  .attr("width", 800)
  .attr("height", 80)
  .append("g")
  .attr("transform", "translate(30,30)");

g.call(slider);

// todo listen slider
// d3.select("#mySlider").on("change", function(d){
//   console.log(d);
//   // selectedValue = this.value
//   // changeSize(selectedValue)
// })

var state_div = d3
  .select("#content")
  .append("div")
  .style("height", "30px")
  .style("width", "200px")
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

// d3.csv("https://raw.githubusercontent.com/KataevaVeronika/visualization/f2f32294d450b97f999308948755110830dbc240/crime_incarceration.csv", function(data) {
//   console.log(data);
// });
const link = "./coordinates_extraction/state_coordinates/csv/polygon.csv";
// link = "https://raw.githubusercontent.com/Emidiant/crime-in-usa-visualisation/main/coordinates_extraction/state_coordinates/csv/polygon.csv"
d3.csv(link, function (data) {
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
});
