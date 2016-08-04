/**
 * Created by albertgao on 30/07/16.
 */
 //load the data
d3.csv('../../data/slide5.csv',function(error,data){
    if (error) throw error;

    // TODO: NEED FIX, NOT WORKING!
    //fill the list first, using d3's selector
    d3.selectAll(".item")
        .data(data)
        .enter()
        .text(function(d){return d.sports});

    //same here, follow the practice
    var margin = {top: 10, right: 30, bottom: 30, left: 40},
        width = 450 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        radius = Math.min(width,height)/2;

    //create the svg element
    var svg = d3.select("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //create the arcs with the radius
    //innderRadius is 0, since it's solid
    var arc = d3.arc()
        .outerRadius(radius)
        .innerRadius(0);

    //prepare the data, pie will generate angles for us
    var pie = d3.pie().value(function(d){ return d.counts});

    //Set up groups
    var arcs = svg.selectAll("g.arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc")
        .attr("transform", "translate(" + radius + ", " + radius + ")");

    //choose some beautiful colors
    var colors = ["#1abc9c","#3498db","#9b59b6","#e67e22","#c0392b","#95a5a6","#34495e","#f1c40f","#d35400"];

    //start to fill with color
    arcs.append("path")
        .transition()
        .attr("fill", function(d, i) {
            return colors[i];
        })
        .attr("d", arc);

    //FIXED! The text can show now! V!
    //adding text to the element
    arcs.append("text")
        .attr("transform", function(d) {
            return "translate(" + arc.centroid(d) + ")";
        })
        .attr("text-anchor", "middle")
        .text(function(d) {
            return d.data.sports;
        });

});