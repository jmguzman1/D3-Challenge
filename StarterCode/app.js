// @TODO: YOUR CODE HERE!
// Define SVG dimensions 
var svgWidth = 900;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append group element
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Parse data from CSV
d3.csv("data.csv").then(function(censusData, err){
  if (err) throw err;
  console.log(censusData);


censusData.forEach(function(data){
    data.id = +data.id;
    data.state = +data.state;
    data.obesity = +data.obesity;
    data.povertyMoe = +data.povertyMoe;
    data.age = +data.age;
    data.income = +data.income;
    data.healthcare = +data.healthcare;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;

  }) 

  //Create scale functions
  var xLinearScale = d3.scaleLinear()
    .domain([20, d3.max(censusData, d => d.obesity)])
    .range([10, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(censusData, d => d.healthcare)])
    .range([height, 0]);

  //Append Axes to the chart
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  //append x and y axis
  var xAxis = chartGroup.append("g")
    //.classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  
  chartGroup.append("g").call(leftAxis);

  //Create Circles
  chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.obesity))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 20)
    .attr("fill", "purple")
    .attr("opacity", ".3");
  
  chartGroup.selectAll("null")
    .data(censusData)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("x", d => xLinearScale(d.obesity))
    .attr("y", d => yLinearScale(d.healthcare))
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("fill", "white");


//Create x & y axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height/2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Obesity")

  chartGroup.append("text")
    .attr("transform", `translate(${width/2}, ${height + margin.top + 25})`)
    .attr("class", "axisText")
    .text("Healthcare")

// Create tooltip in the chart
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>Coverage: ${parseFloat(d.healthcare*100).toFixed(1)}%<br>${label} ${d[chosenXAxis]}`);
    });

circleGroup.call(toolTip);

// Create event to display and hide the tooltip

  chartGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })

// onmouseout event
  
  //   .on("mouseout", function(data, index) {
  //         toolTip.hide(data);
  //       });

  // return chartGroup;


}).catch(function(error) {
  console.log(error);
});



