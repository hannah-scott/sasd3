var width = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

var margin = 100;

width -= margin;
height = width / 1.6 + margin;

svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin)
    .attr("height", height + margin);

var xScale = d3.scaleBand().range ([0, width]).padding(0.4),
    yScale = d3.scaleLinear().range([height, 0]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin/2 + "," + margin/2 + ")");

var sampleData = {data:[
    ["2000", 100],
    ["2001", 101],
    ["2002", 102],
    ["2003", 96],
    ["2004", 100],
    ["2005", 101],
    ["2006", 102],
    ["2007", 96]
]};

var sampleColumnInfo = [
    {label: "year", type: "string"},
    {label: "value", type:"number"}
];


function formatSASData(c, d) {
    // Create container array
    var arr = []

    for(i=0; i < d.data.length; i++) {
        var row = d.data[i]
        var row_dict = new Object;

        // Map column name to value
        for (j=0; j < row.length; j++) {
            row_dict[c[j].label] = row[j];
        }

        // Append row to container array
        arr.push(row_dict);
    }

    return arr
}

function drawChart(columnInfo, data) {
    var xLabel = columnInfo[0].label,
        yLabel = columnInfo[1].label;

    svg.selectAll('*').remove();

    var g = svg.append("g")
        .attr("transform", "translate(" + margin/2 + "," + margin/2 + ")");

    xScale.domain(data.map(function(d) {
        return d[xLabel];
    }));
    yScale.domain([
        0,
        d3.max(data, function(d) {return d[yLabel];})
    ]);

    g.append("g")
    .attr("transform", "translate(" + 0 + "," + height + ")")
    .call(d3.axisBottom(xScale).tickFormat(function(d){
        return d;
        }).ticks(10))
        .enter()
        .append("text")
        .attr("x", 6)
        .attr("dx", "0.71em")
        .attr("text-anchor", "end")
        .text(xLabel);

    g.append("g")
    .call(d3.axisLeft(yScale).tickFormat(function(d){
        return d;
        }).ticks(10))
        .enter()
        .append("text")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text(yLabel);

    // Draw bars
    g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return xScale(d[xLabel]); })
    .attr("y", function(d) { return yScale(d[yLabel]); })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) { return height - yScale(d[yLabel]); });
};

results = sampleData;
columnInfo = sampleColumnInfo;
data = formatSASData(columnInfo, results);
drawChart(columnInfo, data);