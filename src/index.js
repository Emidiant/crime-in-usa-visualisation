let crime = "murder";
let murder_weapon = "murder_cutting";
let state_name = "National";
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

var crime_div = d3
    .select("#content")
    .append("div")
    .attr("id", "crime_div")
    .style("text-align", "center");

const margin_chart = {top: 20, right: 20, bottom: 40, left: 60},
                         width_chart = 400,
                         height_chart = 400;

const crime_charts_div = d3
    .select("#crime_div")
    .append("div")
    .attr("class", "chart1")
    .style("height", height_chart + margin_chart.top + margin_chart.bottom)
    .style("width", width_chart + margin_chart.left + margin_chart.right)
    .style("display", "inline-block")
    .style("text-align", "center");

const murder_charts_div = d3
    .select("#crime_div")
    .append("div")
    .attr("class", "chart2")
    .style("height", height_chart + margin_chart.top + margin_chart.bottom)
    .style("width", width_chart + margin_chart.left + margin_chart.right)
    .style("margin-left", "10px")
    .style("display", "inline-block");

const crime_types = ['murder', 'robbery', 'agg_assault',
    'burglary', 'larceny', 'vehicle_theft',
    'rape', 'mass_shootings', 'hate_crime_murder',
    'hate_crime_other'];
const crime_types_dict = {
    'murder': 'Murder', 'robbery': 'Robbery', 'agg_assault': 'Aggrevated assault',
    'burglary': 'Burglary', 'larceny': 'Larceny', 'vehicle_theft': 'Vehicle theft',
    'rape': 'Rape', 'mass_shootings': 'Mass shooting', 'hate_crime_murder': 'Hate crime murder',
    'hate_crime_other': 'Hate crime other'
};

var dropDown = d3.select(".chart1").append("select")
        .attr("name", "name-list");

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
d3.select(".chart1").select("select").on("change", function(d) {
    var selectedOption = d3.select(this).property("value");
    crime_chart.selectAll("g").remove();
    crime_chart.selectAll("path").remove();
    draw_crime_graph(selectedOption, state_name);
})

const murder_types = ['murder_cutting', 'murder_firearms', 'murder_unarmed', 'murder_other']
const murder_types_dict = {'murder_cutting':'Cutting murders',
                           'murder_firearms': 'Firearms murders',
                           'murder_unarmed': 'Unarmed murders',
                           'murder_other': 'Other murders'}

var dropDown_murder = d3.select(".chart2").append("select")
    .attr("name", "name-list2");

var options_murder = dropDown_murder.selectAll("option")
    .data(murder_types)
    .enter()
    .append("option");
options_murder
    .text(function(d) {
        return murder_types_dict[d];
    })
    .attr("value", function(d) {
        return d;
    });

d3.select(".chart2").select("select").on("change", function(d) {
    var selectedO = d3.select(this).property("value");
    murder_chart.selectAll("g").remove();
    murder_chart.selectAll("path").remove();
    draw_murder_graph(selectedO, state_name);
})

var crime_chart = d3
    .select(".chart1")
    .append("svg")
    .style("height", height_chart + margin_chart.top + margin_chart.bottom)
    .style("width", width_chart + margin_chart.left + margin_chart.right)
    .append("g")
    .attr("transform", "translate(" + margin_chart.left + "," + margin_chart.top + ")");

var murder_chart = d3
    .select(".chart2")
    .append("svg")
    .style("height", height_chart + margin_chart.top + margin_chart.bottom)
    .style("width", width_chart + margin_chart.left + margin_chart.right)
    .append("g")
    .attr("transform", "translate(" + margin_chart.left + "," + margin_chart.top + ")");

dataset_link = "https://raw.githubusercontent.com/KataevaVeronika/visualization/f2f32294d450b97f999308948755110830dbc240/crime_incarceration.csv"
draw_crime_graph(crime, state_name);

function get_max_value(_data, crime, state_name) {
    if (state_name === "National") {
        var crimes = [];
        for (let i = 0; i < _data.length; i++) {
            if (_data[i].state === "National") {
                crimes.push(_data[i][crime]);
            }
        };
        return Math.max(...crimes);
    } else {
        var max_value = 0;
        for (var key in _data) {
            if (_data[key].state != "National") {
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
}

function get_min_value(_data, crime, state_name) {
    if (state_name === "National") {
        var crimes = [];
        for (let i = 0; i < _data.length; i++) {
            if (_data[i].state === "National") {
                crimes.push(_data[i][crime]);
            }
        };
        return Math.min(...crimes);
    } else {
        var min_value = 10E10;
        for (var key in _data) {
            if (_data[key].state != "National") {
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
}

function draw_crime_graph(crime, state_name) {

    d3.csv(dataset_link).then(function (data) {
        var max_value = get_max_value(data, crime, state_name);
        var min_value = get_min_value(data, crime, state_name);

        state_stats = data.filter(function (row) {
            return row["state"] == state_name;
        });

        const crime_stats = [];
        for (let i = 0; i < state_stats.length; i++) {
                crime_stats.push({year: state_stats[i].year, crime: state_stats[i][crime]});
        }
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
    })
}

draw_murder_graph(murder_weapon, state_name);
function draw_murder_graph(murder_weapon, state_name) {

    d3.csv(dataset_link).then(function (data) {
        var max_value = get_max_value(data, murder_weapon, state_name);
        var min_value = get_min_value(data, murder_weapon, state_name);

        state_stats = data.filter(function (row) {
            return row["state"] == state_name;
        });

        if (state_name === "National") {
            var lower_year = 2001;
        } else {
            var lower_year = 2004;
        };

        if (state_name === "National") {
            var n_ticks = 8;
        } else {
            var n_ticks = 6;
        };

        const murder_weapon_stats = [];
        for (let i = 0; i < state_stats.length; i++) {
            if (state_stats[i].year >= lower_year) {
                murder_weapon_stats.push({year: state_stats[i].year, murder_weapon: state_stats[i][murder_weapon]});
            }
        }
        var x = d3.scaleLinear().range([0, width_chart]);
        var y = d3.scaleLinear().range([height_chart, 0]);

        y.domain([min_value, max_value]);
        x.domain([lower_year, 2016]);

        var valueline = d3.line()
            .x(function(d) { return x(d.year); })
            .y(function(d) { return y(d.murder_weapon); });

        murder_chart.append("g")
           .attr("transform", "translate(0," + height_chart + ")")
           .call(d3.axisBottom(x).ticks(n_ticks).tickFormat(d3.format(".0f")));
        murder_chart.append("g")
            .call(d3.axisLeft(y));

        murder_chart.append("path")
            .data([murder_weapon_stats])
            .attr("class", "crime_line")
            .attr("d", valueline);

        if (state_name === "Florida") {
            murder_chart.selectAll("g").remove();
            murder_chart.selectAll("path").remove();
            murder_chart.append("svg:image")
            .attr('x', 0)
            .attr('y', 90)
            .attr('width', "365")
            .attr('opacity', 0.9)
            .attr("href", "./src/images/Florida.jpg");
        }
    })
}
// draw_crime_graph(crime, state_name);

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
    state_name = d.target.firstChild.nodeValue;
    state_div.text(state_name);
    crime_chart.selectAll("g").remove();
    crime_chart.selectAll("path").remove();
    crime = d3.select(".chart1").select("select").property("value");
    draw_crime_graph(crime, state_name);
    murder_chart.selectAll("g").remove();
    murder_chart.selectAll("path").remove();
    murder_weapon = d3.select(".chart2").select("select").property("value");
    draw_murder_graph(murder_weapon, state_name);
}

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
