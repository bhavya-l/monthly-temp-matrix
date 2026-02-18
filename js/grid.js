export function createMatrix(data, mode) {
    const margin = { top: 40, right: 20, bottom: 40, left: 60 };
    const width = 1400;
    const height = 800;

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right + 100)
        .attr("height", height + margin.top + margin.bottom);
    
    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const years = [...new Set(data.map(d => d.year))];
    const months = d3.range(0, 12);

    const xScale = d3.scaleBand()
        .domain(years)
        .range([0, width])
        .padding(0.05);

    const yScale = d3.scaleBand()
        .domain(months)
        .range([0, height])
        .padding(0.05);

    const colorScale = d3.scaleSequential(d3.interpolateRdYlBu)
        .domain([40, 0]);

    g.selectAll(".cell")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "cell")
        .attr("x", d => xScale(d.year))
        .attr("y", d => yScale(d.month))
        .attr("width", xScale.bandwidth())
        .attr("height", yScale.bandwidth())
        .attr("fill", d => colorScale(mode === "max" ? d.maxMonthly : d.minMonthly));

    g.append("g")
        .attr("transform", `translate(0,${height},0)`)
        .call(d3.axisTop(xScale))
        .style("font-size", "16px");

    g.append("g")
        .call(d3.axisLeft(yScale)
        .tickFormat(m => d3.timeFormat("%b")(new Date(2000, m, 1))))
        .style("font-size", "16px");

    return { svg, matrixWidth: width + margin.left, matrixHeight: margin.top };
}