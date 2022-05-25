
const default_opacity = 0.8;
const mouse_over_opacity = 1;
const default_year = 2008;
color_link = "https://raw.githubusercontent.com/Emidiant/crime-in-usa-visualisation/dev-julia/coordinates_extraction/state_coordinates/csv/color.csv";

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
    .value(default_year)
    .step(1)
    .ticks(16)
    .width(750)
    .displayFormat(d3.format(".0f"))
    .tickFormat(d3.format(".0f"))
    .on('onchange', (year) => {
         d3.csv(color_link, function(d) {
             const red_fill = d3.interpolateReds(d[year]);
            svg_map
              .selectAll('.'+ d.state)
              .style("fill", red_fill)
        });
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


  d3.select(this)
      .style("stroke", "black")
      .style("opacity", mouse_over_opacity);
};

var mouseleave = function (d) {
  tooltip.style("visibility", "hidden");

  d3.select(this)
      .style("stroke", "grey")
      .style("opacity", default_opacity);
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

// почему-то ссылка побилась
link_master = "https://raw.githubusercontent.com/Emidiant/crime-in-usa-visualisation/main/coordinates_extraction/state_coordinates/csv/polygon.csv"
link_dev_julia = "https://raw.githubusercontent.com/Emidiant/crime-in-usa-visualisation/dev-julia/coordinates_extraction/state_coordinates/csv/polygon.csv";

draw_map(default_year);

function draw_map(year) {
    d3.csv(link_dev_julia, function (data) {
    var state_name = data.state;
    var state_points = JSON.parse(data.new_coordinates);
    const red_fill = d3.interpolateReds(data[year]);
    if (state_name !== "Alaska" && state_name !== "Hawaii") {
        if (data.type !== "multipolygon") {
            svg_map
                .append("polyline")
                .attr("class", state_name)
                .text(data.state)
                .style("fill", red_fill)
                .attr("stroke", "grey")
                .attr("opacity", default_opacity)
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
                    .attr("class", state_name)
                    .text(data.state)
                    .style("fill", red_fill)
                    .attr("stroke", "grey")
                    .attr("opacity", default_opacity)
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
                    .text(data.state)
                    .attr("class", state_name)
                    .style("fill", red_fill)
                    .attr("stroke", "grey")
                    .attr("opacity", default_opacity)
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
                    .attr("class", state_name)
                    .text(data.state)
                    .style("fill", red_fill)
                    .attr("stroke", "grey")
                    .attr("opacity", default_opacity)
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
}
