/**
 * Created by albertgao on 30/07/16.
 */
d3.csv("../../data/slide7.csv", type, function(error, data) {
    if (error) throw error;

    var keys = data.columns.slice(1);

    //Boilerplate
    var svg = d3.select("svg"),
        margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = svg.attr("width") - margin.left - margin.right,
        height = svg.attr("height") - margin.top - margin.bottom;

    // generate the range of each dimension
    var x = d3.scaleLinear().range([0, width]),
        y = d3.scaleLinear().range([height, 0]),
        z = d3.scaleOrdinal(d3.schemeCategory10);

    var stack = d3.stack();

    // create the area object
    var area = d3.area()
        .x(function(d, i) { return x(d.data.age); })
        .y0(function(d) { return y(d[0]); })
        .y1(function(d) { return y(d[1]); });

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //scale to the range
    //TODO: WHY THE ORDER MATTERS HERE?
    x.domain([24,34]);
    z.domain(keys);
    stack.keys(keys);

    // create area template
    var layer = g.selectAll(".layer")
        .data(stack(data))
        .enter().append("g")
        .attr("class", "layer");

    // append the area to DOM
    layer.append("path")
        .attr("class", "area")
        .style("fill", function(d) { return z(d.key); })
        .attr("d", area);

    // add the label
    layer.filter(function(d) { return d[d.length - 1][1] - d[d.length - 1][0] > 0.01; })
        .append("text")
        .attr("x", width - 6)
        .attr("y", function(d) { return y((d[d.length - 1][0] + d[d.length - 1][1]) / 2); })
        .attr("dy", ".35em")
        .style("font", "10px sans-serif")
        .style("text-anchor", "end")
        .text(function(d) { return d.key; });

    // add the x Axie
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axie
    g.append("g")
        .call(d3.axisLeft(y).ticks(10, "%"));
});

function type(d, i, columns) {
    for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = d[columns[i]] / 100;
    return d;
}
