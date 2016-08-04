/**
 * Created by albertgao on 30/07/16.
 */
d3.csv("../../data/slide8.csv", function(error, data) {
    if (error) throw error;

    // no more rules, this one is too big!
    var width = 960,
        height = 960;

        //ok...
    var svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height);

    var format = d3.format(",d");

    var color = d3.scaleMagma()
        .domain([-4, 4]);

    var stratify = d3.stratify()
        .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

    var pack = d3.pack()
        .size([width - 2, height - 2])
        .padding(3);


    var root = stratify(data)
        .sum(function(d) { return d.value; })
        .sort(function(a, b) { return b.value - a.value; });

    pack(root);

    var node = svg.select("g")
        .selectAll("g")
        .data(root.descendants())
        .enter().append("g")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        .attr("class", function(d) { return "node" + (!d.children ? " node--leaf" : d.depth ? "" : " node--root"); })
        .each(function(d) { d.node = this; })
        .on("mouseover", hovered(true))
        .on("mouseout", hovered(false));

    node.append("circle")
        .attr("id", function(d) { return "node-" + d.id; })
        .attr("r", function(d) { return d.r; })
        .style("fill", function(d) { return color(d.depth); });

    var leaf = node.filter(function(d) { return !d.children; });

    leaf.append("clipPath")
        .attr("id", function(d) { return "clip-" + d.id; })
        .append("use")
        .attr("xlink:href", function(d) { return "#node-" + d.id + ""; });

    leaf.append("text")
        .attr("clip-path", function(d) { return "url(#clip-" + d.id + ")"; })
        .selectAll("tspan")
        .data(function(d) { return d.id.substring(d.id.lastIndexOf(".") + 1).split(/(?=[A-Z][^A-Z])/g); })
        .enter().append("tspan")
        .attr("x", 0)
        .attr("y", function(d, i, nodes) { return 13 + (i - nodes.length / 2 - 0.5) * 10; })
        .text(function(d) { return d; });

    node.append("title")
        .text(function(d) { return d.id + "\n" + format(d.value); });
});

function hovered(hover) {
    return function(d) {
        d3.selectAll(d.ancestors().map(function(d) { return d.node; })).classed("node--hover", hover);
    };
}

