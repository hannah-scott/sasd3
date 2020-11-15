# Basics

## Getting started with D3.js and SAS Viya

In this article we're going to walk through how to build a simple bar chart in D3.js, using the `D3.csv` function. We're then going to look at SAS' example, pull out the refreshing code we need, and write a function to reformat SAS' data into the same format as `D3.csv`. 

At the end we'll have a basic barchart that you can host and point SAS at.

_**Note:** this tutorial assumes a basic knowledge of HTML + JS. No knowledge of D3.js is assumed._

## Building a chart with D3.js

### Setup

First things first, build a simple HTML page, pulling in the latest version of D3.js from their website and adding an SVG canvas.

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Simple barchart</title>

        <meta charset="utf-8">

        <script src="https://d3js.org/d3.v6.min.js"></script>
        
    </head>
    <body>
        <svg width="920" height="600"></svg>
    </body>
</html>
```

You can open this, but it won't display anything.

From my understanding (limited), D3.js is an abstraction of drawing on a normal SVG canvas. So rather than having to specify every detail about the circle you're going to draw, you can use a `circle` function that abstracts the detail out. It also has some nice functions for processing CSV data that we'll make use of.

So next, make a `barchart.js` file and include it in the body of your HTML page:

```html
...
    <body>
        <svg width="920" height="600"></svg>

        <script src="barchart.js"></script>
    </body>
...
```

### Barchart script

We'll go through building the `barchart.js` file in detail.

First, put your SVG canvas into a variable. Specify a `margin` variable that will apply some padding to our graph, and calculate the width and height that our final barchart will be.

```javascript
var svg = d3.select("svg"),
    margin = 40,
    width = svg.attr("width") - margin ,
    height = svg.attr("height") - margin;
```

Next, specify the scale we want to use for our X and Y axes. This is going to be a barchart with the bars on the X-axis, so we use `scaleBand` for the X-axis, with a padding of 0.4. This padding is the space between each bar. 

The Y-axis will be numeric, so we use `scaleLinear`.

```javascript
var xScale = d3.scaleBand().range ([0, width]).padding(0.4),
    yScale = d3.scaleLinear().range([height, 0]);
```

We're then going to append a `g` or 'group' element to our canvas, and offset it to give us some margin. 

It's much easier to put all our elements in a group and move the group, than it is to move all our elements individually.

```javascript
var g = svg.append("g")
       .attr("transform", "translate(" + margin/2 + "," + margin/2 + ")");
```

We're now ready to pull in some data and start building the chart.

### Pulling in data

Knowing nothing about what data D3 will like, let's pull in some using D3.js and have a look at it.

Thinking about our high-level design, we want to build a very basic barchart. What will our data look like?

We will need two columns. One of these will be a categorical variable, probably a string. The other will be some numerical value. For example:

|Category|Value|
|---|---|
|A|98|
|B|201|
|C|35|

D3 has a very handy `csv` function that will load in data for us. Unfortunately, this function only works with HTTP protocol so the data has to be online somewhere. I went trawling and found some data of the height of the Nile river, so we'll use that! Let's take a look at our data:

```javascript
var data = d3.csv("https://people.sc.fsu.edu/~jburkardt/data/csv/nile.csv");

console.log(data);
```