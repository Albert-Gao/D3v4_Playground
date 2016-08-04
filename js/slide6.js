/**
 * Created by albertgao on 30/07/16.
 */
d3.csv("../../data/slide6.csv", type, function(error, data) {
    if (error) throw error;

    //OK, boilerplate
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    //ok...
    var svg = d3.select("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //generate the scale
    var x = d3.scaleBand()
        .domain(data.map(function(d) { return d.age; }))
        .rangeRound([0, width])
        .padding(0.1)
        .align(0.1);

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.total; })]).nice()
        .rangeRound([height, 0]);

    var z = d3.scaleOrdinal()
        .domain(data.columns.slice(1))
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    //use the stack object
    var stack = d3.stack();

    //append the stacked rectangle
    g.selectAll(".serie")
        .data(stack.keys(data.columns.slice(1))(data))
        .enter().append("g")
        .attr("class", "serie")
        .attr("fill", function(d) { return z(d.key); })
        .selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
        .attr("x", function(d) { return x(d.data.age); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width", x.bandwidth());

    // add the x Axis
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    g.append("g")
        .call(d3.axisLeft(y).ticks(10, "s"))
        .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks(10).pop()))
        .attr("dy", "0.35em")
        .attr("text-anchor", "start")
        .attr("fill", "#000")
        .text("HeartRates");

    // add the legend for the columns
    var legend = g.selectAll(".legend")
        .data(data.columns.slice(1).reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
        .style("font", "10px sans-serif");

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", z);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .text(function(d) { return d; });
});

//a filter function to manipulate the pass-in data
function type(d, i, columns) {
    for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
    d.total = t;
    return d;
}
