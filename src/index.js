
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

dataset_link = "https://raw.githubusercontent.com/KataevaVeronika/visualization/f2f32294d450b97f999308948755110830dbc240/crime_incarceration.csv"

var state_click = function (d) {
    var coords = d3.pointer(d);
    var state_name = d.target.firstChild.nodeValue;

    state_div.text(state_name);
    // d3.select(crime_chart).remove();

    const margin_chart = {top: 20, right: 20, bottom: 40, left: 60},
                             width_chart = 400,
                             height_chart = 400;
    const crime_charts_div = d3
        .select("#content")
        .append("div")
        .attr("class", "chart1")
        .style("background-color", "wheat")
        .style("height", height_chart + margin_chart.top + margin_chart.bottom)
        .style("width", width_chart + margin_chart.left + margin_chart.right);

    var dropDown = d3.select(".chart1").append("select")
            .attr("name", "name-list");

    var crime_chart = d3
        .select(".chart1")
        .append("svg")
        .style("height", height_chart + margin_chart.top + margin_chart.bottom)
        .style("width", width_chart + margin_chart.left + margin_chart.right)
        .append("g")
        .attr("transform", "translate(" + margin_chart.left + "," + margin_chart.top + ")");

    d3.csv(dataset_link).then(function (data) {

        let crime = "murder";
        const crime_types = ['murder', 'robbery', 'agg_assault',
                             'burglary', 'larceny', 'vehicle_theft',
                             'rape', 'mass_shootings', 'hate_crime_murder',
                             'hate_crime_other'];
        const crime_types_dict = {'murder': 'Murder', 'robbery': 'Robbery', 'agg_assault': 'Aggrevated assault',
                                  'burglary': 'Burglary', 'larceny': 'Larceny', 'vehicle_theft': 'Vehicle theft',
                                  'rape': 'Rape', 'mass_shootings': 'Mass shooting', 'hate_crime_murder': 'Hate crime murder',
                                  'hate_crime_other': 'Hate crime other'};

        console.log("ge");
        console.log(data[0]["murder"]);

        function draw_crime_graph(crime, state_name) {

            function get_max_value(_data) {
                var max_value = 0;
                for (var key in _data) {
                    if (data[key].state != "National") {
                        var row = [max_value, _data[key][crime]]
                        var row = row.filter(value => !Number.isNaN(value));
                        var row_numbers = [];
                        row.forEach(element => {
                            if (element !== undefined) {
                                row_numbers.push(element);
                            }
                        });
                        max_value = Math.max(...row_numbers);
                    }
                }
                return max_value;
            }
            var max_value = get_max_value(data, crime);
            console.log(max_value);

            function get_min_value(_data) {
                var min_value = 10E10;
                for (var key in _data) {
                    if (data[key].state != "National") {
                        var row = [min_value, _data[key][crime]]
                        var row = row.filter(value => !Number.isNaN(value));
                        var row_numbers = [];
                        row.forEach(element => {
                            if (element !== undefined) {
                                row_numbers.push(element);
                            }
                        });
                        min_value = Math.min(...row_numbers);
                    }
                }
                return min_value;
            }
            var min_value = get_min_value(data, crime);
            console.log(min_value);

            state_stats = data.filter(function (row) {
                return row["state"] == state_name;
            });
            console.log(state_stats);

            const crime_stats = [];
            for (let i = 0; i < state_stats.length; i++) {
                    crime_stats.push({year: state_stats[i].year, crime: state_stats[i][crime]});
            }
            console.log(crime_stats);
            var x = d3.scaleLinear().range([0, width_chart]);
            var y = d3.scaleLinear().range([height_chart, 0]);

            y.domain([min_value, max_value]);
            x.domain([2001, 2016]);

            var valueline = d3.line()
                .x(function(d) { return x(d.year); })
                .y(function(d) { return y(d.crime); });

            crime_chart.append("g")
               .attr("transform", "translate(0," + height_chart + ")")
               .call(d3.axisBottom(x).ticks(8).tickFormat(d3.format(".0f")));
            crime_chart.append("g")
                .call(d3.axisLeft(y));

            crime_chart.append("path")
                .data([crime_stats])
                .attr("class", "crime_line")
                .attr("d", valueline);

        }
            //const sliced = data.map(row => ['type', ...[crime]].reduce((acc, v) => ({ ...acc, [v]: row[v] }), {}));


        draw_crime_graph(crime, state_name);




        var options = dropDown.selectAll("option")
            .data(crime_types)
            .enter()
            .append("option");
        options
            .text(function(d) {
                return crime_types_dict[d];
            })
            .attr("value", function(d) {
                return d;
            });

        d3.select("select").on("change", function(d) {
            var selectedOption = d3.select(this).property("value");
            crime_chart.selectAll("g").remove();
            crime_chart.selectAll("path").remove();
            draw_crime_graph(selectedOption, state_name);
        })
        // state_stats = data.filter(function (row) {
        //     return row["state"] == state_name;
        // });
        //
        // const crimes = [];
        // for (let i = 0; i < state_stats.length; i++) {
        //         crimes.push({year: state_stats[i].year, robbery: state_stats[i].robbery});
        // }
        // console.log(crimes);
        //
        // const max_value = get_max_value(data);
        //
        // var x = d3.scaleLinear().range([0, width_chart]);
        // var y = d3.scaleLinear().range([height_chart, 0]);
        //
        // y.domain([min_value, 2000]);
        // x.domain([2001, 2016]);
        //
        // var valueline = d3.line()
        //     .x(function(d) { return x(d.year); })
        //     .y(function(d) { return y(d.robbery); });
        //
        // crime_chart.append("g")
        //    .attr("transform", "translate(0," + height_chart + ")")
        //    .call(d3.axisBottom(x));
        // crime_chart.append("g")
        //     .call(d3.axisLeft(y));
        //
        // crime_chart.append("path")
        //     .data([crimes])
        //     .attr("class", "line")
        //     .attr("d", valueline);
        //
        // var dropDown = d3.select("#content").append("select")
        //     .attr("name", "name-list");
        //
        // var options = dropDown.selectAll("option")
        //     .data(crime_types)
        //     .enter()
        //     .append("option");
        //
        // options
        //     .text(function(d) {
        //         return crime_types_dict[d];
        //     })
        //     .attr("value", function(d) {
        //         return d;
        //     });
        //
        //     // When the button is changed, run the updateChart function
        // d3.select("select").on("change", function(d) {
        //     // recover the option that has been chosen
        //     var selectedOption = d3.select(this).property("value")
        //     // run the updateChart function with this selected option
        //     console.log(selectedOption)
        //     // update(selectedOption)
        //     crime_chart.remove();
        // })

    })
}



        // const crimes = ["robbery", "agg_assault"]
        // // console.log(data.state);
        // for (let i = 0; i < data.length; i++) {
        //     for (let j = 0; j < crimes.length; j++) {
        //         if (data[i].state != "National") {
        //             if (data[i][j] > max_value) {
        //                 //console.log(data[i]);
        //                 max_value = data[i][j];
        //             }
        //         }
        //     }
        // }
        // console.log(max_value);
        // console.log(years);
        // console.log(murders);
  //       state_stats = data.filter(function (row) {
  //           return row["state"] == state_name;
  //     });
  //   })
  // }

//   const margin_chart = {top: 20, right: 20, bottom: 40, left: 40},
//     width_chart = 400,
//     height_chart = 400;
//
//   var x = d3.scaleLinear().range([0, width_chart]);
//   var y = d3.scaleLinear().range([height_chart, 0]);
//   // define the line
//   var valueline = d3.line()
//       .x(function(d) { return x(d.year); })
//       .y(function(d) { return y(d.murder); });
//

//
//   d3.csv(dataset_link).then(function(data) {
//       x.domain(d3.extent([2001, 2002, 2003, 2004, 2005]));
//       y.domain([14000, 20000]);
//       crime_chart.append("g")
//          .attr("transform", "translate(0," + height_chart + ")")
//          .call(d3.axisBottom(x));
//       crime_chart.append("g")
//           .call(d3.axisLeft(y));
//       const data_crime = [];
//       for (let i = 0; i < data.length; i++) {
//           if (data[i].state === "National") {
//               console.log(data[i].year, data[i].murder)
//               data_crime.push({year: data[i].year, murder: data[i].murder});
//           }
//       }
//       crime_chart.append("path")
//         .data([data_crime])
//         .attr("class", "line")
//         .attr("d", valueline);
//
//       console.log(data_crime)
//   });
//
//   function update(selectedGroup) {
//
//       // Create new data with the selection?
//       var dataFilter = data.map(function(d){return {time: d.time, value:d[selectedGroup]} })
//
//       // Give these new data to update line
//       line
//           .datum(dataFilter)
//           .transition()
//           .duration(1000)
//           .attr("d", d3.line()
//             .x(function(d) { return x(+d.time) })
//             .y(function(d) { return y(+d.value) })
//           )
//           .attr("stroke", function(d){ return myColor(selectedGroup) })
//     }
//
//     // When the button is changed, run the updateChart function
//     d3.select("select").on("change", function(d) {
//         // recover the option that has been chosen
//         var selectedOption = d3.select(this).property("value")
//         // run the updateChart function with this selected option
//         console.log(selectedOption)
//         update(selectedOption)
//     })
// }

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
                .style("fill", red_fill)
                .text(state_name)
                .attr("points", state_points);
        } else {
            for (let i = 0; i < state_points.length; i += 1) {
                svg_map
                    .append("polyline")
                    .attr("class", state_name)
                    .text(data.state)
                    .style("fill", red_fill)
                    .attr("points", state_points[i]);
            }
        }
    } else {
        if (state_name === "Alaska") {
            for (let i = 0; i < state_points.length; i += 1) {
                svg_map
                    .append("polyline")
                    .text(state_name)
                    .attr("class", state_name)
                    .style("fill", red_fill)
                    .attr("points", state_points[i])
                    .attr("transform", "translate(-90,-1070)");
            }
        } else {
            for (let i = 0; i < state_points.length; i += 1) {
                svg_map
                    .append("polyline")
                    .attr("class", state_name)
                    .text(state_name)
                    .style("fill", red_fill)
                    .attr("points", state_points[i])
                    .attr("transform", "translate(680, 250)");
          }
        }
    }
    svg_map.selectAll("polyline")
        .attr("stroke", "grey")
        .attr("opacity", default_opacity)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("click", state_click)
        .on("mouseleave", mouseleave);

});

// перемещение карты после отрисовки
svg_map.attr("transform", "translate(-20,-40)")
}
