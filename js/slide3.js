/**
 * Created by albertgao on 30/07/16.
 */
// load the data
d3.csv("../../data/slide3.csv", function(error, data) {
    if (error) throw error;

    //Boilerplate vReal
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    //TODO: MAYBE COULD DRY?
    // really boring
    var svg = d3.select("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // format the data
    var parseTime = d3.timeParse("%d/%m/%y");
    data.forEach(function(d) {
        d.wellnessDate = parseTime(d.wellnessDate);
        d.counts = +d.counts;
    });

    var x = d3.scaleTime()
        .domain(d3.extent(data, function(d) { return d.wellnessDate; }))
        .range([0, width]);

    var y = d3.scaleLinear()
        .domain(d3.extent(data, function(d) { return d.counts; }))
        .range([height, 0]);

    var line = d3.line()
        .x(function(d) { return x(d.wellnessDate); })
        .y(function(d) { return y(d.counts); });

    //add the real line,just few lines...
    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

    //TODO: Becomes boilerplates, could DRY?
    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    //TODO: Becomes boilerplates, could DRY?
    // add the x Axis
    svg.append("g")
        .call(d3.axisLeft(y))
});
