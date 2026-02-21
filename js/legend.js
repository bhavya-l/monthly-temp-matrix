export function createLegend(svg, colorScale, matrixWidth) {
  const legendWidth = 25;
  const legendHeight = 300;

  const defs = svg.append("defs");

  const gradient = defs
    .append("linearGradient")
    .attr("id", "temp-gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "0%")
    .attr("y2", "100%");

  const stops = d3.range(0, 1.01, 0.1);
  stops.forEach((t) => {
    const value = t * 40;
    gradient
      .append("stop")
      .attr("offset", `${t * 100}%`)
      .attr("stop-color", colorScale(value));
  });

  const legend = svg
    .append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${matrixWidth})`);

  legend
    .append("rect")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .style("fill", "url(#temp-gradient)")
    .style("stroke", "#000");

  const legendScale = d3.scaleLinear().domain([40, 0]).range([legendHeight, 0]);

  const legendAxis = d3
    .axisRight(legendScale)
    .ticks(2)
    .tickFormat((d) => d + " C");

  legend
    .append("g")
    .attr("transform", `translate(${legendWidth},0)`)
    .call(legendAxis)
    .selectAll("text")
    .style("font-size", "16px");
}
