// Dimensions
const margin = { top: 40, right: 20, bottom: 40, left: 60 };
const width = 900 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Create SVG
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Load CSV
d3.csv("temperature_daily.csv").then(data => {

    console.log("Data loaded!");
    console.log(data);

    // For now just draw a test rectangle
    svg.append("rect")
        .attr("x", 50)
        .attr("y", 50)
        .attr("width", 100)
        .attr("height", 100)
        .attr("fill", "steelblue");

});
