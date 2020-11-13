var width=960, height=600;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var xScale = d3.scaleBand().range ([0, width]).padding(0.4),
yScale = d3.scaleLinear().range ([height, 0]);

var g = svg.append("g")
       .attr("transform", "translate(" + 100 + "," + 100 + ")");

d3.csv("https://raw.githubusercontent.com/curran/data/gh-pages/nyt/gun_sales/all-data.csv").then(function(data) {

    xScale.domain(data.map(function(d) { return d.year; }));
    yScale.domain([0, d3.max(data, function(d) { return d.guns_total_per_1000; })]);

    g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale))
    .attr('stroke', 'black');

    g.append("g")
    .call(d3.axisLeft(yScale).tickFormat(function(d){
        return "$" + d;
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
    .attr("y", function(d) { return yScale(d.guns_total_per_1000); })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) { return height - yScale(d.value); });
});