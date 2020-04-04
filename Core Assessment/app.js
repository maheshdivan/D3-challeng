// Chart Params
var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 100, left: 100 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


  d3.csv("data.csv").then(function(data) {

  console.log(data);
  
    data.forEach(function(d) {
        d.smokes= +d.smokes;
        d.age = +d.age;
    });

    var xLinearScaleAge = d3.scaleLinear()
    .domain([30, d3.max(data, d => d.age)])
    .range([0,width]);

    var yLinearScaleSmoke = d3.scaleLinear()
    .domain([6, d3.max(data, d => d.smokes)])
    .range([height,0]);

     // Create axis functions for each feature
    var bottomAxisAge = d3.axisBottom(xLinearScaleAge);
    var leftAxisSmoke = d3.axisLeft(yLinearScaleSmoke);

  // Add axis
    var bottomAxis = chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxisAge);

    var leftAxis = chartGroup.append("g")
    .call(leftAxisSmoke);

    // append circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(data)
      .enter()

      var circles = circlesGroup.append("circle")
      .attr("cy", d => yLinearScaleSmoke(d.smokes))
      .attr("cx", d => xLinearScaleAge(d.age))
      .attr("r", "10")
      .classed("stateCircle", true)

      var text = circlesGroup.append("text")
      .attr("y", d => yLinearScaleSmoke(d.smokes) + 3)
      .attr("x", d => xLinearScaleAge(d.age) - 7)
      .attr("fill", "white")
      .text(d => d.abbr)
      .style("text-align", "left")
      .style("font-size", "10px")
      .style("font-weight", "bold")

      //Initialize Tooltip
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .html(function(d) {
        return (`State: ${d.abbr}<br>Smokers: ${d.smokes}<br>Age: $${d.age}`);
    });

    // Create the tooltip in circles and text.
    chartGroup.call(toolTip);

    // Create "mouseover" event listener to display tooltip
    circles.on("mouseover", function(d) {
      toolTip.show(d, this);
    })
    //Create "mouseout" event listener to hide tooltip
    .on("mouseout", function(d) {
      toolTip.hide(d, this);
    });

    // Create mouseover/mouseout for text also
    text.on("mouseover", function(d) {
      toolTip.show(d, this);
    })

    .on("mouseout", function(d) {
      toolTip.hide(d, this);
    });
    var yAxis3 = chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - (margin.left / 2) - 50)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "aText active")
      .text("Smokers (%)");

    var xAxis3 = chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 70})`)
    .attr("class", "aText active")
    .text("Age (Median)");

    

//     // Create transitions via axis label clicks
//     yAxis1.on("click", function () {
//       // change axis class to active
//       d3.select(this)
//         .attr("class","aText active");

//       yAxis2.attr("class", "aText inactive");

//       yAxis3.attr("class", "aText inactive");

//       // change y-coordinate of circles
//       circles.transition()
//         .duration(500)
//         .attr("cy", d => yLinearScaleObesity(d.obesity));
      
//       // change y-coordinate of text
//       text.transition()
//         .duration(500)
//         .attr("y", d => yLinearScaleObesity(d.obesity) + 3);

//       // change axis labels
//       leftAxis.call(leftAxisObesity);

//       // change tooltip based on x-axis
//       if (xAxis1.classed("active")) {
//         toolTip.html(d => {
//           return (`State: ${d.abbr}<br>Obesity: ${d.obesity}%<br>Income: $${d.income}`);
//         })
//       }
//       else if (xAxis2.classed("active")){
//         toolTip.html(d => {
//           return (`State: ${d.abbr}<br>Obesity: ${d.obesity}%
//           <br>Poverty: $${d.poverty}`);
//         })
//       }
//       else {
//         toolTip.html(d => {
//           return (`State: ${d.abbr}<br>Obesity: ${d.obesity}%
//           <br>Age: $${d.age}`);
//         })
//       }
//     });

//     yAxis2.on("click", function () {
//       // change axis class to active
//       d3.select(this)
//         .attr("class","aText active");

//       // change other axis to inactive
//       yAxis1.attr("class","aText inactive");

//       yAxis3.attr("class","aText inactive");

//       circles.transition()
//         .duration(500)
//         .attr("cy", d => yLinearScaleHC(d.healthcare));
      
//       text.transition()
//         .duration(500)
//         .attr("y", d => yLinearScaleHC(d.healthcare) + 3);

//       leftAxis.call(leftAxisHC);

//       // change tooltip based on x-axis
//       if (xAxis1.classed("active")) {
//         toolTip.html(d => {
//           return (`State: ${d.abbr}<br>Income: ${d.income}<br>Healthcare: ${d.healthcare}%`);
//         })
//       }
//       else if (xAxis2.classed("active")){
//         toolTip.html(d => {
//           return (`State: ${d.abbr}<br>Poverty: ${d.poverty}%
//           <br>Healthcare: ${d.healthcare}%`);
//         })
//       }
//       else {
//         toolTip.html(d => {
//           return (`State: ${d.abbr}<br>Age: ${d.age}%
//           <br>Healthcare: ${d.healthcare}%`);
//         })
//       }

//     });


//     yAxis3.on("click", function () {
//       // change axis class to active
//       d3.select(this)
//         .attr("class","aText active");

//       // change other axis to inactive
//       yAxis1.attr("class","aText inactive");
//       yAxis2.attr("class","aText inactive");

//       circles.transition()
//         .duration(500)
//         .attr("cy", d => yLinearScaleHC(d.smokes));
      
//       text.transition()
//         .duration(500)
//         .attr("y", d => yLinearScaleHC(d.smokes) + 3);

//       leftAxis.call(leftAxisSmoke);

//       // change tooltip based on x-axis
//       if (xAxis1.classed("active")) {
//         toolTip.html(d => {
//           return (`State: ${d.abbr}<br>Income: ${d.income}<br>Smokes: ${d.smokes}%`);
//         })
//       }
//       else if (xAxis2.classed("active")){
//         toolTip.html(d => {
//           return (`State: ${d.abbr}<br>Poverty: ${d.poverty}%
//           <br>Smokes: ${d.smokes}%`);
//         })
//       }
//       else {
//         toolTip.html(d => {
//           return (`State: ${d.abbr}<br>Age: ${d.age}%
//           <br>Smokes: ${d.smokes}%`);
//         })
//       }

//     });

//     xAxis1.on("click", function () {
//       // change axis class to active
//       d3.select(this)
//         .attr("class","aText active");

//       // change other axis to inactive
//       xAxis2.attr("class", "aText inactive");
//       xAxis3.attr("class", "aText inactive");

//       // change y-coordinate of circles
//       circles.transition()
//         .duration(500)
//         .attr("cx", d => xLinearScaleIncome(d.income));
      
//       // change y-coordinate of text
//       text.transition()
//         .duration(500)
//         .attr("x", d => xLinearScaleIncome(d.income) - 7);

//       // change axis labels
//       bottomAxis.call(bottomAxisIncome);

//       // change tooltip based on x-axis
//       if (yAxis1.classed("active")) {
//         toolTip.html(d => {
//           return (`State: ${d.abbr}<br>Obesity: ${d.obesity}%<br>Income: $${d.income}`);
//         })
//       }
//       else if (yAxis2.classed("active")){
//         toolTip.html(d => {
//           return (`State: ${d.abbr}<br>Healthcare: ${d.healthcare}%
//           <br>Income: ${d.income}`);
//         })
//       }
//       else {
//         toolTip.html(d => {
//           return (`State: ${d.abbr}<br>Smokes: ${d.smokes}%
//           <br>Income: ${d.income}`);
//         })
//       }
//     });

//     xAxis2.on("click", function () {
//       // change axis class to active
//       d3.select(this)
//         .attr("class","aText active");

//       // change other axis to inactive
//       xAxis1.attr("class","aText inactive");
//       xAxis3.attr("class","aText inactive");

//       circles.transition()
//         .duration(500)
//         .attr("cx", d => xLinearScalePoverty(d.poverty));
      
//       text.transition()
//         .duration(500)
//         .attr("x", d => xLinearScalePoverty(d.poverty) - 7);

//       bottomAxis.call(bottomAxisPoverty);

//       // change tooltip based on x-axis
//       if (yAxis1.classed("active")) {
//         toolTip.html(d => {
//           return (`State: ${d.abbr}<br>Poverty: ${d.poverty}%<br>Obesity: $${d.obesity}`);
//         })
//       }
//       else if (yAxis2.classed("active")){
//         toolTip.html(d => {
//           return (`State: ${d.abbr}<br>Poverty: ${d.poverty}%
//           <br>Healthcare: ${d.healthcare}%`);
//         })
//       }
//       else {
//         toolTip.html(d => {
//           return (`State: ${d.abbr}<br>Poverty: ${d.poverty}%
//           <br>Smokes: ${d.smokes}%`);
//         })
//       }
//     });

//     xAxis3.on("click", function () {
//       // change axis class to active
//       d3.select(this)
//         .attr("class","aText active");

//       // change other axis to inactive
//       xAxis1.attr("class","aText inactive");
//       xAxis2.attr("class","aText inactive");

//       circles.transition()
//         .duration(500)
//         .attr("cx", d => xLinearScaleAge(d.age));
      
//       text.transition()
//         .duration(500)
//         .attr("x", d => xLinearScaleAge(d.age) - 7);

//       bottomAxis.call(bottomAxisAge);

//       // change tooltip based on x-axis
//       if (yAxis1.classed("active")) {
//         toolTip.html(d => {
//           return (`State: ${d.abbr}<br>Age: ${d.age}%<br>Obesity: $${d.obesity}`);
//         })
//       }
//       else if (yAxis2.classed("active")){
//         toolTip.html(d => {
//           return (`State: ${d.abbr}<br>Age: ${d.age}%
//           <br>Healthcare: ${d.healthcare}%`);
//         })
//       }
//       else {
//         toolTip.html(d => {
//           return (`State: ${d.abbr}<br>Age: ${d.age}%
//           <br>Smokes: ${d.smokes}%`);
//         })
//       }
//     });
});