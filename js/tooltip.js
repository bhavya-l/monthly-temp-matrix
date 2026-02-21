export function createTooltip() {
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background", "white")
    .style("padding", "8px 12px")
    .style("border", "1px solid #ccc")
    .style("border-radius", "4px")
    .style("font-size", "14px")
    .style("pointer-events", "none")
    .style("opacity", 0);

  function show(event, d) {
    const monthName = d3.timeFormat("%B")(new Date(2000, d.month, 1));
    tooltip.style("opacity", 1).html(`
        <strong>${monthName} ${d.year}</strong><br/>
        ${"max"}: 
        ${d.maxMonthly != null ? d.maxMonthly.toFixed(1) : "No data"}
        ${"min"}: 
        ${d.minMonthly != null ? d.minMonthly.toFixed(1) : "No data"}
      `);
  }

  function move(event) {
    tooltip
      .style("left", event.pageX + 15 + "px")
      .style("top", event.pageY - 28 + "px");
  }

  function hide() {
    tooltip.style("opacity", 0);
  }

  return { show, move, hide };
}
