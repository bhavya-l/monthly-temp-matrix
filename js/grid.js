import { createTooltip } from "./tooltip.js";

export function createMatrixView(data, initialMode) {
  const margin = { top: 40, right: 20, bottom: 40, left: 60 };
  const width = 1400;
  const height = 800;

  const tooltip = createTooltip();

  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right + 100)
    .attr("height", height + margin.top + margin.bottom);

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const years = [...new Set(data.map((d) => d.year))];
  const months = d3.range(0, 12);
  const xScale = d3.scaleBand().domain(years).range([0, width]).padding(0.05);
  const yScale = d3.scaleBand().domain(months).range([0, height]).padding(0.05);
  const colorScale = d3.scaleSequential(d3.interpolateRdYlBu).domain([40, 0]);

  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale))
    .style("font-size", "16px");

  g.append("g")
    .call(
      d3
        .axisLeft(yScale)
        .tickFormat((m) => d3.timeFormat("%b")(new Date(2000, m, 1))),
    )
    .style("font-size", "16px");

  function drawCells(mode) {
    g.selectAll(".cell-group").remove();
    const cellGroups = g
      .selectAll(".cell-group")
      .data(data, (d) => d.year + "-" + d.month)
      .enter()
      .append("g")
      .attr("class", "cell-group")
      .attr(
        "transform",
        (d) => `translate(${xScale(d.year)}, ${yScale(d.month)})`,
      );

    cellGroups
      .append("rect")
      .attr("class", "cell")
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .attr("fill", (d) => {
        const value = mode === "max" ? d.maxMonthly : d.minMonthly;
        return value == null ? "#eee" : colorScale(value);
      })
      .style("stroke", "#fff")
      .style("stroke-width", "1px");

    cellGroups.each(function (d) {
      const cellWidth = xScale.bandwidth();
      const cellHeight = yScale.bandwidth();

      const xMini = d3
        .scaleLinear()
        .domain([1, d3.max(d.days, (dd) => dd.day)])
        .range([2, cellWidth - 2]);

      const yMini = d3
        .scaleLinear()
        .domain([
          d3.min(d.days, (dd) => dd.min),
          d3.max(d.days, (dd) => dd.max),
        ])
        .range([cellHeight - 2, 2]);

      const lineMax = d3
        .line()
        .x((dd) => xMini(dd.day))
        .y((dd) => yMini(dd.max));

      const lineMin = d3
        .line()
        .x((dd) => xMini(dd.day))
        .y((dd) => yMini(dd.min));

      const group = d3.select(this);

      group
        .append("path")
        .datum(d.days)
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 1.2)
        .attr("d", lineMax);

      group
        .append("path")
        .datum(d.days)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 1)
        .attr("opacity", 0.8)
        .attr("d", lineMin);
    });

    cellGroups
      .on("mouseover", function (event, d) {
        tooltip.show(event, d, mode);
        d3.select(this)
          .select("rect")
          .style("stroke", "black")
          .style("stroke-width", "2px");
      })
      .on("mousemove", function (event) {
        tooltip.move(event);
      })
      .on("mouseout", function () {
        tooltip.hide();
        d3.select(this)
          .select("rect")
          .style("stroke", "#fff")
          .style("stroke-width", "1px");
      });
  }
  drawCells(initialMode);
  return {
    svg,
    matrixWidth: width + margin.left,
    matrixHeight: margin.top,
    update: function (newMode) {
      drawCells(newMode);
    },
  };
}
