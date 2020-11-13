var width=760 ;
var height=400;

var svg = d3.select("body").append("svg")
    .attr("width", width + 200)
    .attr("height", height + 200);

var xScale = d3.scaleBand().range ([0, width]).padding(0.4),
yScale = d3.scaleLinear().range([height, 0]);

var g = svg.append("g")
       .attr("transform", "translate(" + 100 + "," + 100 + ")");

function drawChart(columnInfo, data) {
    

    console.log(data);

    xScale.domain(data.map(function(d) { console.log(d);return d[columnInfo[0]]; }));
    yScale.domain([0, d3.max(data, function(d) { console.log(d[columnInfo[1]]); return d[columnInfo[1]]; })]);

    console.log("x scale domain: " + xScale.domain());
    console.log("y scale domain: " + yScale.domain());

    

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

    g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return xScale(d[columnInfo[0]]); })
    .attr("y", function(d) { return yScale(d[columnInfo[1]]); })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) { return height - yScale(d[columnInfo[1]]); });
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
            data.then(function(d) {drawChart(d);}); 
        }
    }
}

function formatSASData(c, d) {
    // Create a dict with columns from columnInfo and data rows
    dict = []

    // For each row of data
    for(i=0; i < d.length; i++) {
        // Create dictionary of row mapped to column names
        row = d[i]
        row_dict = []

        for (j=0; j < row.length; j++) {
            row_dict[c[j]] = row[j];
        }

        dict.push(row_dict);
    }
    // console.log(dict);

    return dict
}

if (window.addEventListener) {
    // For standards-compliant web browsers
    window.addEventListener("message", onMessage, false);
} else {
    window.attachEvent("onmessage", onMessage);
}

// d3.csv("https://raw.githubusercontent.com/hannah-scott/D3.js/main/data.csv").then(function(data) {drawChart(data)});