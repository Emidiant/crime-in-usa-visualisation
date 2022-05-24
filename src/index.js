
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

var svg_map = d3
    .select("#content")
    .append("svg")
    .attr("width", 800)
    .attr("height", 400)
    .append("g");

// svg.append("svg:image")
//     .attr('x', 70)
//     .attr('y', 30)
//     .attr('width', 655)
//     .attr('opacity', 0.4)
//     .attr("xlink:href", "https://states-of-america.ru/karty-ssha/karty/karta-shtatov-ssha.jpg")

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

// sliderHorizontal, sliderVertical, sliderTop, sliderRight, sliderBottom, sliderLeft

const slider = d3
    .sliderHorizontal()
    .min(2001)
    .max(2016)
    .value(2008)
    .step(1)
    .ticks(16)
    .width(750)
    .displayFormat(d3.format(".0f"))
    .tickFormat(d3.format(".0f"))
    .on('onchange', (val) => {
      console.log(val);
    });

const slider_svg = d3
    .select("#content")
    .append("svg")
    .attr("class", "#mySlider")
    .attr("width", 800)
    .attr("height", 80)
    .append("g")
    .attr("transform", "translate(30,30)")
    .call(slider);

var state_div = d3
    .select("#content")
    .append("div")
    .attr("id", "state_div")
    .style("height", "30px")
    .style("width", "200px")
    .style("text-align", "center")
    .style("font-size", "1.5em")
    .style("margin-top", "15px")
    .style("margin-left", "auto")
    .style("margin-right", "auto")
    .text("National");

// todo добавляешь svg

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
  state_div.text(state_name);
  console.log(state_name, coords[0], coords[1]);
  // todo обновлять два представления
};

// d3.csv("https://raw.githubusercontent.com/KataevaVeronika/visualization/f2f32294d450b97f999308948755110830dbc240/crime_incarceration.csv", function(data) {
//   console.log(data);
// });

// почему-то ссылка побилась
// link = "https://raw.githubusercontent.com/Emidiant/crime-in-usa-visualisation/main/coordinates_extraction/state_coordinates/csv/polygon.csv"
link = "https://raw.githubusercontent.com/Emidiant/crime-in-usa-visualisation/main/coordinates_extraction/state_coordinates/csv/polygon.csv"

d3.csv(link, function (data) {
  var state_name = data.state;
  var state_points = JSON.parse(data.new_coordinates);
  if (state_name !== "Alaska" && state_name !== "Hawaii") {
    if (data.type !== "multipolygon") {
      svg_map
        .append("polyline")
        // .data(state_name)
        .text(data.state)
        .style("fill", "orange")
        .attr("stroke", "grey")
        .attr("opacity", 0.6)
        .attr("points", state_points)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("click", state_click)
        .on("mouseleave", mouseleave);
      } else {
      console.log("multi", state_name)
      for (var i = 0; i < state_points.length; i += 1) {
        svg_map
            .append("polyline")
            // .data(state_name)
            .text(data.state)
            .style("fill", "green")
            .attr("stroke", "grey")
            .attr("opacity", 0.6)
            .attr("points", state_points[i])
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("click", state_click)
            .on("mouseleave", mouseleave);
      }
    }
  } else {
    console.log("state", state_name)
    if (state_name === "Alaska") {
          for (var i = 0; i < state_points.length; i += 1) {
        svg_map
            .append("polyline")
            // .data(state_name)
            .text(data.state)
            .style("fill", "green")
            .attr("stroke", "grey")
            .attr("opacity", 0.6)
            .attr("points", state_points[i])
            .attr("transform", "translate(-90,-1070)")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("click", state_click)
            .on("mouseleave", mouseleave);
      }
    } else {
        for (var i = 0; i < state_points.length; i += 1) {
        svg_map
            .append("polyline")
            // .data(state_name)
            .text(data.state)
            .style("fill", "green")
            .attr("stroke", "grey")
            .attr("opacity", 0.6)
            .attr("points", state_points[i])
            .attr("transform", "translate(680, 250)")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("click", state_click)
            .on("mouseleave", mouseleave);
      }
    }
  }

});

// перемещение карты после отрисовки
svg_map.attr("transform", "translate(-20,-40)")
