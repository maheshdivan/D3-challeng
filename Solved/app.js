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
        d.income = +d.income;
        d.smokes= +d.smokes;
        d.age = +d.age;
        d.obesity = +d.obesity;
        d.poverty = +d.poverty;
        d.healthcare = +d.healthcare;
    });

    var xLinearScalePoverty = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.poverty)])
    .range([0, width]);

    var xLinearScaleIncome = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.income)])
    .range([0,width]);

    var yLinearScaleHC = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.healthcare)])
    .range([height, 0]);

    var yLinearScaleObesity = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.obesity)])
    .range([height,0]);

     // Create axis functions for each feature
    var bottomAxisIncome = d3.axisBottom(xLinearScaleIncome);
    var bottomAxisPoverty = d3.axisBottom(xLinearScalePoverty);
    var leftAxisHC = d3.axisLeft(yLinearScaleHC);
    var leftAxisObesity = d3.axisLeft(yLinearScaleObesity);

  // Add x-axis
    var bottomAxis = chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxisIncome);

    var leftAxis = chartGroup.append("g")
    .call(leftAxisObesity);

    // append circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(data)
      .enter()

      var circles = circlesGroup.append("circle")
      .attr("cy", d => yLinearScaleObesity(d.obesity))
      .attr("cx", d => xLinearScaleIncome(d.income))
      .attr("r", "10")
      .classed("stateCircle", true)

      var text = circlesGroup.append("text")
      .attr("y", d => yLinearScaleObesity(d.obesity) + 3)
      .attr("x", d => xLinearScaleIncome(d.income) - 7)
      .attr("fill", "white")
      .text(d => d.abbr)
      .style("text-align", "left")
      .style("font-size", "10px")
      .style("font-weight", "bold")

      //Initialize Tooltip
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .html(function(d) {
        return (`State: ${d.abbr}<br>Obesity: ${d.obesity}<br>Income: $${d.income}`);
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
    // Step 4: Create "mouseout" event listener to hide tooltip
    .on("mouseout", function(d) {
      toolTip.hide(d, this);
    });

    // Create axes labels
    var yAxis1 = chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - (margin.left / 2) - 20)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "aText active")
      .text("Obesity(%)");

    var yAxis2 = chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - (margin.left / 2) - 50)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "aText inactive")
      .text("Lacks Healthcare(%)");

    var xAxis1 = chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "aText active")
    .text("Household Income");

    var xAxis2 = chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 55})`)
    .attr("class", "aText inactive")
    .text("Poverty(%)");

    // Create transitions via axis label clicks
    yAxis1.on("click", function () {
      // change axis class to active
      d3.select(this)
        .attr("class","aText active");

      yAxis2.attr("class", "aText inactive");

      // change y-coordinate of circles
      circles.transition()
        .duration(500)
        .attr("cy", d => yLinearScaleObesity(d.obesity));
      
      // change y-coordinate of text
      text.transition()
        .duration(500)
        .attr("y", d => yLinearScaleObesity(d.obesity) + 3);

      // change axis labels
      leftAxis.call(leftAxisObesity);

      // change tooltip based on x-axis
      if (xAxis1.classed("active")) {
        toolTip.html(d => {
          return (`State: ${d.abbr}<br>Obesity: ${d.obesity}%<br>Income: $${d.income}`);
        })
      }
      else {
        toolTip.html(d => {
          return (`State: ${d.abbr}<br>Obesity: ${d.obesity}%
          <br>Poverty: $${d.poverty}`);
        })
      }
    });

    yAxis2.on("click", function () {
      // change axis class to active
      d3.select(this)
        .attr("class","aText active");

      // change other axis to inactive
      yAxis1.attr("class","aText inactive");

      circles.transition()
        .duration(500)
        .attr("cy", d => yLinearScaleHC(d.healthcare));
      
      text.transition()
        .duration(500)
        .attr("y", d => yLinearScaleHC(d.healthcare) + 3);

      leftAxis.call(leftAxisHC);

      // change tooltip based on x-axis
      if (xAxis1.classed("active")) {
        toolTip.html(d => {
          return (`State: ${d.abbr}<br>Income: ${d.income}<br>Healthcare: ${d.healthcare}%`);
        })
      }
      else {
        toolTip.html(d => {
          return (`State: ${d.abbr}<br>Poverty: ${d.poverty}%
          <br>Healthcare: ${d.healthcare}%`);
        })
      }
    });

    xAxis1.on("click", function () {
      // change axis class to active
      d3.select(this)
        .attr("class","aText active");

      // change other axis to inactive
      xAxis2.attr("class", "aText inactive");

      // change y-coordinate of circles
      circles.transition()
        .duration(500)
        .attr("cx", d => xLinearScaleIncome(d.income));
      
      // change y-coordinate of text
      text.transition()
        .duration(500)
        .attr("x", d => xLinearScaleIncome(d.income) - 7);

      // change axis labels
      bottomAxis.call(bottomAxisIncome);

      // change tooltip based on x-axis
      if (yAxis1.classed("active")) {
        toolTip.html(d => {
          return (`State: ${d.abbr}<br>Obesity: ${d.obesity}%<br>Income: $${d.income}`);
        })
      }
      else {
        toolTip.html(d => {
          return (`State: ${d.abbr}<br>Healthcare: ${d.healthcare}%
          <br>Income: ${d.income}`);
        })
      }
    });

    xAxis2.on("click", function () {
      // change axis class to active
      d3.select(this)
        .attr("class","aText active");

      // change other axis to inactive
      xAxis1.attr("class","aText inactive");

      circles.transition()
        .duration(500)
        .attr("cx", d => xLinearScalePoverty(d.poverty));
      
      text.transition()
        .duration(500)
        .attr("x", d => xLinearScalePoverty(d.poverty) - 7);

      bottomAxis.call(bottomAxisPoverty);

      // change tooltip based on x-axis
      if (yAxis1.classed("active")) {
        toolTip.html(d => {
          return (`State: ${d.abbr}<br>Poverty: ${d.poverty}%<br>Obesity: $${d.obesity}`);
        })
      }
      else {
        toolTip.html(d => {
          return (`State: ${d.abbr}<br>Poverty: ${d.poverty}%
          <br>Healthcare: ${d.healthcare}%`);
        })
      }
    });
});