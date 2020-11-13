/*
    Simple D3 barchart for SAS Data-Driven Content objects

    Both variables must be numeric
*/



// Sample data
var self = this;
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

// SVG settings
var width=760 ;
var height=400;

var svg = d3.select("body").append("svg")
    .attr("width", width + 200)
    .attr("height", height + 200);

var xScale = d3.scaleBand().range ([0, width]).padding(0.4),
yScale = d3.scaleLinear().range([height, 0]);

var g = svg.append("g")
       .attr("transform", "translate(" + 100 + "," + 100 + ")");

// Draw simple bar chart
function drawChart(columnInfo, data) {

    // Scale X and Y
    xScale.domain(data.map(function(d) { return d[columnInfo[0].label]; }));
    yScale.domain([0, d3.max(data, function(d) { return d[columnInfo[1].label]; })]);

    // Draw axes
    g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale).tickFormat(function(d){
        return d;
        }).ticks(10))
        .append("text")
        .attr("x", 6)
        .attr("dx", "0.71em")
        .attr("text-anchor", "end")
        
        .text("year");

    g.append("g")
    .call(d3.axisLeft(yScale).tickFormat(function(d){
        return d;
        }).ticks(10))
        .append("text")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("value");

    // Draw bars
    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return xScale(d[columnInfo[0].label]); })
        .attr("y", function(d) { return yScale(d[columnInfo[1].label]); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return height - yScale(d[columnInfo[1].label]); });
};


// Retrieve data and begin processing
function onMessage(evt) {
    if (evt && evt.data) {
        var results = null;
        var columnInfo = null;

        self.resultName = evt.data.resultName;

        if (evt.data.availableRowCount >= 0) {
            results = evt.data;
            columnInfo = evt.data.columns;
        }
        else if (evt.data.availableRowCount == -1) {
            results = sampleData;
            columnInfo = sampleColumnInfo;
        }

        if(results) {
            data = formatSASData(columnInfo, results);
            drawChart(columnInfo, data);
        }
    }
}

// Convert data from SAS supplied format to D3 format
function formatSASData(c, d) {
    // Create a dict with columns from columnInfo and data rows
    dict = []

    // For each row of data
    for(i=0; i < d.data.length; i++) {
        // Create dictionary of row mapped to column names
        row = d.data[i]
        row_dict = []

        for (j=0; j < row.length; j++) {
            row_dict[c[j].label] = row[j];
        }

        dict.push(row_dict);
    }

    return dict
}

// Fetch data and run process
if (window.addEventListener) {
    // For standards-compliant web browsers
    window.addEventListener("message", onMessage, false);
} else {
    window.attachEvent("onmessage", onMessage);
}

// // DEBUG settings
// results = sampleData;
// columnInfo = sampleColumnInfo;
// data = formatSASData(columnInfo, results);
// drawChart(columnInfo, data);