/**
 * Created by albertgao on 30/07/16.
 */
 //load the data
d3.csv('../../data/slide4.csv',function(error,data){
    if (error) throw error;

    // set the dimensions and margins of the graph
    // it is a practice developed by Mike,
    // It simply adds some margins outside the graph,
    // like the CSS Box Model. Thus, later in the code,
    // we can only use width or height to refer the data.
    var margin = {top: 10, right: 30, bottom: 30, left: 40},
        width = 450 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // append the svg object using prior variable
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    // Doing this since I mentioned before
    // to follow the Mark's convention.
    var svg = d3.select("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create the xScale, so we can project our domain
    // into some range that fits out graph
    // We deal with y later, follow the rules that we should
    // use the bins as data to create the y range.
    var x = d3.scaleLinear()
        .domain([21, d3.max(data, function(d){return d.age;})])
        .range([0,width]);

    // create the bins using Histogram in D3.js v4,damn the documents!
    var histo = d3.histogram()
        .value(function(d){return d.age;})
        .domain(x.domain())
        .thresholds(x.ticks(15));

    var bins = histo(data);

    //create the yScale to scale the data in y domain
    var y = d3.scaleLinear()
        .domain([0,d3.max(bins, function(d){return d.length;})])
        .range([height,0]);

    // append the bar rectangles to the svg element
    svg.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
        .transition()
        .attr("class", "bar")
        .attr("x", 1)
        .attr("transform", function(d) {
            return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
        .attr("height", function(d) { return height - y(d.length); });

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));
});