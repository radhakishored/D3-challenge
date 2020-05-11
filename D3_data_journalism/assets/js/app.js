// @TODO: YOUR CODE HERE!

// Step 1: Set up our chart
//= ================================
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 40,
    right: 40,
    bottom: 80,
    left: 90
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper,

var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
	
var toolTip= svg.append('div')	
						.attr("class", "tooltip")
						.style("opacity", .9);	


var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Step 3:

d3.csv("/assets/data/data.csv").then(function(statesData) {
    statesData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });
    //console.log(statesData);

    // Step 5: Create Scales
    var xLinearScale = d3.scaleLinear()
        .domain(d3.extent(statesData, d => d.poverty))
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(statesData, d => d.healthcare)])
        .range([height, 0]);

    // Step 6: Create Axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
	
	

    // Step 7: Append axes. Create ChartGroup
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    chartGroup.append("g")
        .call(leftAxis);

    //Step 8: Create circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(statesData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "10")
        .attr("fill", "teal")
        .attr("opacity", ".7")
        .classed("stateCircle", true);
		
	var div = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 1);	

		
    var circlesGroup = chartGroup.selectAll()
        .data(statesData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .attr("dy", 6)
        .classed("stateText", true)
        .style("font-size", "11px")
        .style("text-anchor", "middle")
        .style("fill", "white")
        .text(d => (d.abbr));
		circlesGroup.on("mouseover", function(d) {      
            div.transition()        
                .duration(20) 
				.style("display", "block")
                .style("opacity", "1")
				.style("position", "absolute")
				//.style("width", "80px")
				//.style("height", "30px")
				.style("padding", "2px")
				.style("font","12px sans-serif")
				.style("text-align", "center")
				.style("background", "#1a9ab0")
				.style("border","0")
				.style("border-radius", "10px");
            div .html(`${d.state}<br>Poverty:${d.poverty} +%<br>Lacks Healthcare:+ ${d.healthcare}`)  
                .style("left", (d3.event.pageX) + "px")     
                .style("top", (d3.event.pageY - 28) + "px");    
            });
			
			circlesGroup.on("mouseout", function(d) {
				div.transition()        
					.duration(20) 
					.style("display", "none")
				    .style("opacity", 0);
			});
    
    // Step 10: Create Labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare(%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 25})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");
});