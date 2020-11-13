var width=960 ;
var height=600;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var xScale = d3.scaleBand().range ([0, width]).padding(0.4),
yScale = d3.scaleLinear().range([height, 0]);

var g = svg.append("g")
       .attr("transform", "translate(" + 100 + "," + 100 + ")");

d3.csv("https://raw.githubusercontent.com/hannah-scott/D3.js/main/data.csv").then(function(data) {

    console.log(data);

    xScale.domain(data.map(function(d) { console.log(d);return d.year; }));
    yScale.domain([0, d3.max(data, function(d) { console.log(d.value); return d.value; })]);

    console.log("x scale domain: " + xScale.domain());
    console.log("y scale domain: " + yScale.domain());

    g.append("g")
        .attr("transform", "translate(0," + width + ")")
        .call(d3.axisBottom(xScale))
        .attr('stroke', 'black');

    g.append("g")
    .call(d3.axisLeft(yScale).tickFormat(function(d){
        return d;
        }).ticks(10))
        .append("text")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("value");

    g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return xScale(d.year); })
    .attr("y", function(d) { return yScale(d.value); })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) { return yScale(d.value); });
});