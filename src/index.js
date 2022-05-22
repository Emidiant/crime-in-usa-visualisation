import * as d3 from "d3";

var svg = d3.select(".map");

//   .attr("viewBox", "100 450 200 200");

var points1 = [
  [200, 200],
  [200, 100],
  [100, 100],
  [100, 200],
  [200, 200]
];

var mouseover = function (d) {
  d3.select(this).style("stroke", "black");
};

var mouseleave = function (d) {
  d3.select(this).style("stroke", "none");
};

var state_click = function (d) {
  var coords = d3.pointer(d);
  // todo нужна функция, которая определяет принадлежность тому или иному полигону
  console.log("Mouse here!!", coords[0], coords[1]);
};

// d3.csv("https://raw.githubusercontent.com/KataevaVeronika/visualization/f2f32294d450b97f999308948755110830dbc240/crime_incarceration.csv", function(data) {
//   console.log(data);
// });
svg
  .append("polyline")
  .style("fill", "orange")
  .attr("points", points1)
  .on("mouseover", mouseover)
  .on("click", state_click)
  .on("mouseleave", mouseleave);
// var points2 = [[]];

// svg
//   .append("polyline")
//   .style("fill", "orange")
//   .style("opacity", 0.3)
//   .attr("points", points2);

// svg
//   .append("polyline")
//   .style("stroke", "orange")
//   .style("fill", "none")
//   .attr("points", points2);

// var points3 = [[]];

// svg
//   .append("polyline")
//   .style("stroke", "black")
//   .style("fill", "none")
//   .attr("points", points3);

// var points4 = [[]];

// svg
//   .append("polyline")
//   .style("fill", "orange")
//   .style("opacity", 0.2)
//   .attr("points", points4);

// svg
//   .append("polyline")
//   .style("fill", "none")
//   .style("stroke", "orange")
//   .attr("points", points4);
