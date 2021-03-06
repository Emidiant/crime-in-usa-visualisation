let crime = "murder";
let murder_weapon = "murder_cutting";
let state_name = "National";
const default_opacity = 0.8;
const mouse_over_opacity = 1;
const default_year = 2008;

const title = d3
    .select("#content")
    .append("div")
    .style("height", "30px")
    .style("width", "300px")
    .style("text-align", "center")
    .style("font-size", "1.8em")
    .style("margin-left", "auto")
    .style("margin-bottom", "10px")
    .style("margin-right", "auto")
    .html("Crime in United States");

const div_map_slider = d3.select("#content")
    .append("div")
    .attr("class", "div_map_slider")
    .style("width", "800px")
    .style("height", "490px")
    .style("display", "block")
    .style("margin", "auto")
    .style("border", "2px solid #aaaac2")
    .style("border-radius", "15px");

const svg_map = d3
    .select(".div_map_slider")
    .append("svg")
    .attr("width", 800)
    .attr("height", 400)
    .append("g");

svg_map.append("g")
    .attr("transform", "translate(555,30)")
    .append(() => Legend(
        d3.scaleSequential([0.00032, 0.00332], d3.interpolateReds), {
            width: 260,
            ticks: 5,
            title: "Murder percentage of total crimes in the state",
            tickFormat: "%"
    }));

const tooltip = d3
    .select(".div_map_slider")
    .append("div")
    .style("display", "block")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background-color", "rgba(255, 255, 255, 0.7)")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");

const color_link = "https://raw.githubusercontent.com/Emidiant/crime-in-usa-visualisation/main/coordinates_extraction/state_coordinates/csv/color.csv";
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
    .select(".div_map_slider")
    .append("svg")
    .attr("class", "#mySlider")
    .attr("width", 800)
    .attr("height", 80)
    .append("g")
    .attr("transform", "translate(30,30)")
    .call(slider);

const state_div = d3
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
    .style("margin-bottom", "10px")
    .text("National");

const crime_div = d3
    .select("#content")
    .append("div")
    .attr("id", "crime_div")
    .style("text-align", "center");

const margin_chart = {top: 5, right: 38, bottom: 30, left: 60},
                         width_chart = 400,
                         height_chart = 400;

const crime_charts_div = d3
    .select("#crime_div")
    .append("div")
    .attr("class", "chart1")
    .style("height", height_chart + margin_chart.top + margin_chart.bottom)
    .style("width", width_chart + margin_chart.left + margin_chart.right);

const murder_charts_div = d3
    .select("#crime_div")
    .append("div")
    .attr("class", "chart2")
    .style("height", height_chart + margin_chart.top + margin_chart.bottom)
    .style("width", width_chart + margin_chart.left + margin_chart.right)

const crime_types = ['murder', 'robbery', 'agg_assault',
    'burglary', 'larceny', 'vehicle_theft',
    'rape', 'mass_shootings', 'hate_crime_murder',
    'hate_crime_other'];
crime_types.sort();

const crime_types_dict = {
    'murder': 'Murder', 'robbery': 'Robbery', 'agg_assault': 'Aggrevated assault',
    'burglary': 'Burglary', 'larceny': 'Larceny', 'vehicle_theft': 'Vehicle theft',
    'rape': 'Rape', 'mass_shootings': 'Mass shooting', 'hate_crime_murder': 'Hate crime murder',
    'hate_crime_other': 'Hate crime other'
};

const dropDown = d3.select(".chart1")
    .append("div")
    .attr("class", "selector")
    .append("select")
    .attr("name", "name-list");

const options = dropDown.selectAll("option")
    .data(crime_types)
    .enter()
    .append("option")
    .text(function(d) { return crime_types_dict[d]; })
    .attr("value", function(d) { return d; });

d3.select(".chart1").select("select").on("change", function(d) {
    const selectedOption = d3.select(this).property("value");
    crime_chart.selectAll("g").remove();
    crime_chart.selectAll("path").remove();
    draw_crime_graph(selectedOption, state_name);
})

const murder_types = ['murder_cutting', 'murder_firearms', 'murder_unarmed', 'murder_other']
const murder_types_dict = {'murder_cutting':'Cutting murders',
                           'murder_firearms': 'Firearms murders',
                           'murder_unarmed': 'Unarmed murders',
                           'murder_other': 'Other murders'}

const dropDown_murder = d3.select(".chart2")
    .append("div")
    .attr("class", "selector")
    .append("select")
    .attr("name", "name-list2");

const options_murder = dropDown_murder.selectAll("option")
    .data(murder_types)
    .enter()
    .append("option")
    .text(function(d) { return murder_types_dict[d]; })
    .attr("value", function(d) { return d; });

d3.select(".chart2").select("select").on("change", function(d) {
    const selectedO = d3.select(this).property("value");
    murder_chart.selectAll("g").remove();
    murder_chart.selectAll("path").remove();
    draw_murder_graph(selectedO, state_name);
})

const crime_chart = d3
    .select(".chart1")
    .append("svg")
    .style("height", height_chart + margin_chart.top + margin_chart.bottom)
    .style("width", width_chart + margin_chart.left + margin_chart.right)
    .append("g")
    .attr("transform", "translate(" + margin_chart.left + "," + margin_chart.top + ")");

const murder_chart = d3
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
        }
        return Math.max(...crimes) * 1.2;
    } else {
        let max_value = 0;
        for (let key in _data) {
            if (_data[key].state !== "National") {
                let row = [max_value, _data[key][crime]];
                row = row.filter(value => !Number.isNaN(value));
                const row_numbers = [];
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
        const crimes = [];
        for (let i = 0; i < _data.length; i++) {
            if (_data[i].state === "National") {
                crimes.push(_data[i][crime]);
            }
        }
        return Math.min(...crimes) * 0.8;
    } else {
        let min_value = 10E10;
        for (let key in _data) {
            if (_data[key].state !== "National") {
                let row = [min_value, _data[key][crime]];
                row = row.filter(value => !Number.isNaN(value));
                const row_numbers = [];
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
        const max_value = get_max_value(data, crime, state_name);
        const min_value = get_min_value(data, crime, state_name);

        let state_stats = data.filter(function (row) {
            return row["state"] === state_name;
        });

        const crime_stats = [];
        for (let i = 0; i < state_stats.length; i++) {
                crime_stats.push({year: state_stats[i].year, crime: state_stats[i][crime]});
        }
        const x = d3.scaleLinear().range([0, width_chart]);
        const y = d3.scaleLinear().range([height_chart, 0]);

        y.domain([min_value, max_value]);
        x.domain([2001, 2016]);

        const valueline = d3.line()
            .x(function (d) {
                return x(d.year);
            })
            .y(function (d) {
                return y(d.crime);
            });

        crime_chart.append("g")
           .attr("transform", "translate(0," + height_chart + ")")
           .call(d3.axisBottom(x).ticks(8).tickFormat(d3.format(".0f")));
        crime_chart.append("g")
            .call(d3.axisLeft(y));

        crime_chart.append("path")
            .data([crime_stats])
            .attr("class", "crime_line")
            .attr("d", valueline);

        var focus = crime_chart
            .append('g')
            .append('circle')
            .style("fill", "#c92e2e")
            .attr("stroke", "black")
            .attr('r', 3.5)
            .style("opacity", 0);

        var focusText = crime_chart
            .append('g')
            .append('text')
            .style("opacity", 0)
            .style("font-size", "0.75em")
            .attr("text-anchor", "left")
            .attr("alignment-baseline", "middle")

        crime_chart
            .append('rect')
            .style("fill", "none")
            .style("pointer-events", "all")
            .style('margin-bottom', "0")
            .attr('width', width_chart)
            .attr('height', height_chart-40)
            .attr('y', 40)
            .on('mouseover', mouseover_focus)
            .on('mousemove', mousemove_focus)
            .on('mouseout', mouseout_focus);

        var bisect = d3.bisector(function(d) { return d.year; }).left;

        function mouseover_focus() {
            focus.style("opacity", 1)
            focusText.style("opacity",1)
        }

        function mousemove_focus(event) {
            const x0 = x.invert(d3.pointer(event)[0] - 10);
            const i = bisect(crime_stats, x0, 1);
            let selectedData = crime_stats[i]
            focus
                .attr("cx", x(selectedData.year))
                .attr("cy", y(selectedData.crime))
            focusText
                .html(selectedData.crime)
                .attr("x", x(selectedData.year) - 10)
                .attr("y", y(selectedData.crime) - 15)
        }
        function mouseout_focus() {
            focus.style("opacity", 0)
            focusText.style("opacity", 0)
        }
    })
}

draw_murder_graph(murder_weapon, state_name);
function draw_murder_graph(murder_weapon, state_name) {

    d3.csv(dataset_link).then(function (data) {
        let n_ticks, lower_year;
        const max_value = get_max_value(data, murder_weapon, state_name);
        const min_value = get_min_value(data, murder_weapon, state_name);

        const state_stats = data.filter(function (row) {
            return row["state"] === state_name;
        });

        if (state_name === "National") {
            lower_year = 2001;
        } else {
            lower_year = 2004;
        }

        if (state_name === "National") {
            n_ticks = 8;
        } else {
            n_ticks = 6;
        }

        const murder_weapon_stats = [];
        for (let i = 0; i < state_stats.length; i++) {
            if (state_stats[i].year >= lower_year) {
                murder_weapon_stats.push({year: state_stats[i].year, murder_weapon: state_stats[i][murder_weapon]});
            }
        }
        const x = d3.scaleLinear().range([0, width_chart]);
        const y = d3.scaleLinear().range([height_chart, 0]);

        y.domain([min_value, max_value]);
        x.domain([lower_year, 2016]);

        const valueline = d3.line()
            .x(function (d) {
                return x(d.year);
            })
            .y(function (d) {
                return y(d.murder_weapon);
            });

        murder_chart.append("g")
           .attr("transform", "translate(0," + height_chart + ")")
           .call(d3.axisBottom(x).ticks(n_ticks).tickFormat(d3.format(".0f")));
        murder_chart.append("g")
            .call(d3.axisLeft(y));

        murder_chart.append("path")
            .data([murder_weapon_stats])
            .attr("class", "crime_line")
            .attr("d", valueline);

        var focus = murder_chart
            .append('g')
            .append('circle')
            .style("fill", "#c92e2e")
            .attr("stroke", "black")
            .attr('r', 3.5)
            .style("opacity", 0);

        var focusText = murder_chart
            .append('g')
            .append('text')
            .style("opacity", 0)
            .style("font-size", "0.75em")
            .attr("text-anchor", "left")
            .attr("alignment-baseline", "middle")

        murder_chart
            .append('rect')
            .style("fill", "none")
            .style("pointer-events", "all")
            .style('margin-bottom', "0")
            .attr('width', width_chart)
            .attr('height', height_chart-40)
            .attr('y', 40)
            .on('mouseover', mouseover_focus)
            .on('mousemove', mousemove_focus)
            .on('mouseout', mouseout_focus);

        var bisect = d3.bisector(function(d) { return d.year; }).left;

        function mouseover_focus() {
            focus.style("opacity", 1)
            focusText.style("opacity",1)
        }

        function mousemove_focus(event) {
            const x0 = x.invert(d3.pointer(event)[0] - 10);
            const i = bisect(murder_weapon_stats, x0, 1);
            let selectedData = murder_weapon_stats[i]
            focus
                .attr("cx", x(selectedData.year))
                .attr("cy", y(selectedData.murder_weapon))
            focusText
                .html(selectedData.murder_weapon)
                .attr("x", x(selectedData.year) - 10)
                .attr("y", y(selectedData.murder_weapon) - 15)
        }
        function mouseout_focus() {
            focus.style("opacity", 0)
            focusText.style("opacity", 0)
        }

        if (state_name === "Florida") {
            murder_chart.selectAll("g").remove();
            murder_chart.selectAll("path").remove();
            murder_chart.append("text")
                .text("Florida did not contribute to the NIBRS data collection")
                .style("font-size", "0.8em")
                .attr('x', 0)
                .attr('y', 80)
                .attr('width', "365")
                .style("text-align", "center")
                .style("color", "black");
            murder_chart.append("svg:image")
                .attr('x', 0)
                .attr('y', 90)
                .attr('width', "365")
                .attr('opacity', 0.9)
                .attr("href", "./src/images/Florida.jpg");
        }
    })
}

const mouseover = function (d) {
    tooltip.style("visibility", "visible");

    d3.select(this)
        .style("stroke", "black")
        .style("opacity", mouse_over_opacity);
};

const mouseleave = function (d) {
    tooltip.style("visibility", "hidden");

    d3.select(this)
        .style("stroke", "grey")
        .style("opacity", default_opacity);
};

const mousemove = function (d) {
    const state_name = d.target.firstChild.nodeValue;

    tooltip
        .style("top", d.pageY + "px")
        .style("left", d.pageX + "px")
        .html(state_name);
};

const state_click = function (d) {
    state_name = d.target.firstChild.nodeValue;
    state_div.text(state_name);
    crime_chart.selectAll("g").remove();
    crime_chart.selectAll("path").remove();
    crime = d3.select(".chart1").select("select").property("value");
    draw_crime_graph(crime, state_name);
    murder_chart.selectAll("g").remove();
    murder_chart.selectAll("path").remove();
    murder_chart.select("image").remove();
    murder_chart.select("text").remove();
    murder_weapon = d3.select(".chart2").select("select").property("value");
    draw_murder_graph(murder_weapon, state_name);
};

draw_map(default_year);

function draw_map(year) {
    const link_master = "https://raw.githubusercontent.com/Emidiant/crime-in-usa-visualisation/main/coordinates_extraction/state_coordinates/csv/polygon.csv"
    d3.csv(link_master, function (data) {
        const state_name = data.state;
        const state_points = JSON.parse(data.new_coordinates);
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
                        .attr("transform", "translate(-90,-1075)");
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

// ?????????????????????? ?????????? ?????????? ??????????????????
svg_map.attr("transform", "translate(-20,-25)")
}
