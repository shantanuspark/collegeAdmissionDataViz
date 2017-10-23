var d3 = require('d3');
var legend = require('d3-svg-legend')

//Setting width of canvas to the fluid-container of bootstrap
var width = d3.select('.container-fluid').node().getBoundingClientRect().width - 50;
var height = 600

//Creating Canvas
var canvas = d3.select('.container-fluid')
  .append('svg')
  .attr("width", width)
  .attr("height", height)
  .append('g')
  .attr("transform", "translate(0,0)");

//Importing Data        
var data = require("./collegeData.csv");

//Creating 3 scales for raduis, color and stroke
var radiusScale = d3.scaleSqrt()
  .domain([0, 1])
  .range([5, 30])

var colorScale = d3.scaleLinear()
  .domain([600, 1600])
  .range(["#47bb5e", "#2e497b"])

var strokScale = d3.scaleSqrt()
  .domain([1, 36])
  .range([1, 100]);

//Creating forces

//force for instate tution < 10000
var forceXSeparate = d3.forceX(function (d) {
  if (d.TUITIONFEE_IN < 10000)
    return width / 4;
  else
    return width * 3 / 4;
}).strength(0.05)

//force for instate tution < 20000
var forceXSeparateINState25 = d3.forceX(function (d) {
  if (d.TUITIONFEE_IN < 25000)
    return width / 4;
  else
    return width * 3 / 4;
}).strength(0.05)

//force for out state tution < 20000
var forceXSeparateOUTState20 = d3.forceX(function (d) {
  if (d.TUITIONFEE_OUT < 20000)
    return width / 4;
  else
    return width * 3 / 4;
}).strength(0.05)

//force for out state tution < 30000
var forceXSeparateOUTState30 = d3.forceX(function (d) {
  if (d.TUITIONFEE_OUT < 30000)
    return width / 4;
  else
    return width * 3 / 4;
}).strength(0.05)

//force for admission rate < 0.5
var forceXSeparateAR = d3.forceX(function (d) {
  if (d.ADM_RATE_ALL <= 0.5)
    return width / 4;
  else
    return width * 3 / 4;
}).strength(0.05)

//force for admission rate < 0.5
var forceXSeparateSAT = d3.forceX(function (d) {
  if (d.SAT_AVG_ALL <= 950)
    return width / 4;
  else if (d.SAT_AVG_ALL <= 1300)
    return width * 2 / 4;
  else
    return width * 3 / 4;
}).strength(0.05)

//force for admission rate < 0.5
var forceXSeparateACT = d3.forceX(function (d) {
  if (d.ACTCMMID <= 24)
    return width / 4;
  else if (d.ACTCMMID <= 30)
    return width * 2 / 4;
  else
    return width * 3 / 4;
}).strength(0.05)

//normal force x
var forceXCombine = d3.forceX(function (d) {
  return width / 2;
}).strength(0.05)

//colusion force
var forceCollide = d3.forceCollide(function (row) {
  return radiusScale(row.ADM_RATE_ALL) + 4;
})

//forces acting on simulation
var simulation = d3.forceSimulation()
  .force("x", forceXCombine)
  .force("y", d3.forceY(height / 2).strength(0.05))
  .force("collide", forceCollide)

// Define the div for the tooltip
var circles = canvas.selectAll(".inst")
  .data(data)
  .enter()
  .append("circle")
  .attr("class", "inst")
  .attr("r", function (d) { return radiusScale(d.ADM_RATE_ALL); })
  .attr("fill", function (d) {
    return colorScale(d.SAT_AVG_ALL);
  })
  .attr("opacity", 0.9)
  .attr("stroke", "black")
  .attr("stroke-width", "5")
  .attr("stroke-dasharray", function (d) {
    var scale = d3.scaleLinear()
      .domain([1, 36])
      .range([1, 2 * Math.PI * radiusScale(d.ADM_RATE_ALL)])
    return scale(d.ACTCMMID);
  })
  .on('mouseover', function (d) {
    d3.select(this).style("cursor", "pointer");
    div.transition()
      .duration(200)
      .style("opacity", .9);
    div.html("<span class='badge badge-secondary'>" + d.INSTNM + "</span>")
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY - 20) + "px")
  })
  .on('mouseout', function (d) {
    d3.select(this).style("cursor", "default");
    div.transition()
      .duration(500)
      .style("opacity", 0);
  })
  .attr("data-toggle", "popover")
  .attr("title", function (d) {
    return "<a target='_blank' href='http://" + d.INSTURL + "'>" + d.INSTNM + "</a>"
  })
  .attr("data-content", function (d) {
    return '<ul class="list-group"><li class="list-group-item d-flex justify-content-between align-items-center">Admission Rate<span class="badge badge-primary badge-pill">' + Math.round(d.ADM_RATE_ALL * 100) / 100 + '</span></li><li class="list-group-item d-flex justify-content-between align-items-center">Average SAT Score<span class="badge badge-primary badge-pill">' + d.SAT_AVG_ALL + '</span></li><li class="list-group-item d-flex justify-content-between align-items-center">Average ACT Score<span class="badge badge-primary badge-pill">' + d.ACTCMMID + '</span></li><li class="list-group-item d-flex justify-content-between align-items-center">In State Tution<span class="badge badge-primary badge-pill">$ ' + d.TUITIONFEE_IN + '</span></li><li class="list-group-item d-flex justify-content-between align-items-center">Out of State Tution<span class="badge badge-primary badge-pill">$ ' + d.TUITIONFEE_OUT + '</span></li></ul>';
  })
  .attr("data-trigger", "focus")
  .attr("data-html", "true")
  .attr("role", "button")
  .attr("tabindex", "0");

//tool tip div
var div = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

//changing simulation on click of buttons

d3.select("#inState10").on("click", function () {
  simulation
    .force('x', forceXSeparate)
    .alphaTarget(0.3)
    .restart()
});

d3.select("#inState25").on("click", function () {
  simulation
    .force('x', forceXSeparateINState25)
    .alphaTarget(0.3)
    .restart()
});

d3.select("#outState20").on("click", function () {
  simulation
    .force('x', forceXSeparateOUTState20)
    .alphaTarget(0.3)
    .restart()
});

d3.select("#outState30").on("click", function () {
  simulation
    .force('x', forceXSeparateOUTState30)
    .alphaTarget(0.3)
    .restart()
});

d3.select("#ar5").on("click", function () {
  simulation
    .force('x', forceXSeparateAR)
    .alphaTarget(0.3)
    .restart()
});

d3.select("#sat").on("click", function () {
  simulation
    .force('x', forceXSeparateSAT)
    .alphaTarget(0.5)
    .restart()
});

d3.select("#act").on("click", function () {
  simulation
    .force('x', forceXSeparateACT)
    .alphaTarget(0.5)
    .restart()
});

d3.select("#combine").on("click", function () {
  simulation
    .force('x', forceXCombine)
    .alphaTarget(0.3)
    .restart()
});

simulation.nodes(data)
  .on('tick', ticked);

function ticked() {
  circles
    .attr("cx", function (d) {
      return d.x
    })
    .attr("cy", function (d) {
      return d.y
    })

}

// Legend for SAT Score
var svg = d3.select(".legend");
svg.attr("width", d3.select('.container-fluid').node().getBoundingClientRect().width - 50)
svg.append("g")
  .attr("class", "legendLinear col-sm")
  .attr("transform", "translate(20,20)");

var legendLinear = legend.legendColor()
  .shapeWidth(50)
  .orient('horizontal')
  .scale(colorScale)
  .title("SAT Score");

svg.select(".legendLinear")
  .call(legendLinear);

  // Legend for Acceptance rate
svg.append("g")
  .attr("class", "legendSize")
  .attr("transform", "translate(" + (width / 3) + ", 20)");

var legendSize = legend.legendSize()
  .scale(radiusScale)
  .shape('circle')
  .shapePadding(15)
  .labelOffset(15)
  .orient('horizontal')
  .title("Acceptance Rate");

svg.select(".legendSize")
  .call(legendSize);

svg.selectAll(".legendCells")
  .attr("style", "fill: rgb(46, 73, 123);");

//Legend for ACT Score

//x and y padding for sat score legend
var xPadding = width * 2 / 3
var yPadding = d3.select('.legendLinear').node().getBBox().height

var actLegend = svg.append("g")
  .attr("class", "satlegend")
  .attr("transform", "translate(" + xPadding + ", 20)");

actLegend
  .append("text")
  .text("ACT Score")


actLegend
  .append("circle")
  .attr("r", radiusScale(0.9))
  .attr("transform", "translate(" + radiusScale(0.9) + ", " + yPadding / 2 + ")")
  .attr("fill", "rgb(46, 73, 123)")
  .attr("opacity", "0.9")
  .attr("stroke", "black")
  .attr("stroke-width", "5")
  .attr("stroke-dasharray", function (d) {
    var scale = d3.scaleLinear()
      .domain([1, 36])
      .range([1, 2 * Math.PI * radiusScale(0.9)])
    return scale(18);
  })

actLegend
  .append("text")
  .text("18")
  .attr("transform", "translate(" + radiusScale(0.3) + ", " + (yPadding + 8) + ")")

actLegend
  .append("circle")
  .attr("r", radiusScale(0.9))
  .attr("transform", "translate(" + (radiusScale(0.9) * 3 + 10) + ", " + yPadding / 2 + ")")
  .attr("fill", "rgb(46, 73, 123)")
  .attr("opacity", "0.9")
  .attr("stroke", "black")
  .attr("stroke-width", "5")
  .attr("stroke-dasharray", function (d) {
    var scale = d3.scaleLinear()
      .domain([1, 36])
      .range([1, 2 * Math.PI * radiusScale(0.9)])
    return scale(24);
  })

actLegend
  .append("text")
  .text("30")
  .attr("transform", "translate(" + (radiusScale(0.3) + radiusScale(0.9) * 2 + 10) + ", " + (yPadding + 8) + ")")

actLegend
  .append("circle")
  .attr("r", radiusScale(0.9))
  .attr("transform", "translate(" + (radiusScale(0.9) * 5 + 20) + ", " + yPadding / 2 + ")")
  .attr("fill", "rgb(46, 73, 123)")
  .attr("opacity", "0.9")
  .attr("stroke", "black")
  .attr("stroke-width", "5")
  .attr("stroke-dasharray", function (d) {
    var scale = d3.scaleLinear()
      .domain([1, 36])
      .range([1, 2 * Math.PI * radiusScale(0.9)])
    return scale(30);
  })

actLegend
  .append("text")
  .text("30")
  .attr("transform", "translate(" + (radiusScale(0.3) + radiusScale(0.9) * 4 + 20) + ", " + (yPadding + 8) + ")")


actLegend
  .append("circle")
  .attr("r", radiusScale(0.9))
  .attr("transform", "translate(" + (radiusScale(0.9) * 7 + 30) + ", " + yPadding / 2 + ")")
  .attr("fill", "rgb(46, 73, 123)")
  .attr("opacity", "0.9")
  .attr("stroke", "black")
  .attr("stroke-width", "5")
  .attr("stroke-dasharray", function (d) {
    var scale = d3.scaleLinear()
      .domain([1, 36])
      .range([1, 2 * Math.PI * radiusScale(0.9)])
    return scale(36);
  })

actLegend
  .append("text")
  .text("36")
  .attr("transform", "translate(" + (radiusScale(0.3) + radiusScale(0.9) * 6 + 30) + ", " + (yPadding + 8) + ")")