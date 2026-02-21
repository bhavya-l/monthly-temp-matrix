import { processTemps } from "./data.js";
import { createMatrixView } from "./grid.js";
import { createLegend } from "./legend.js";

let mode = "max";

const toggleBtn = document.getElementById("toggle");

toggleBtn.addEventListener("click", () => {
  mode = mode === "max" ? "min" : "max";
  toggleBtn.textContent =
    mode === "max" ? "Switch to Min Temperature" : "Switch to Max Temperature";

  d3.select("#chart").selectAll("*").remove();
  init();
});

function init() {
  d3.csv("data/temperature_daily.csv").then((rawTemps) => {
    const processed = processTemps(rawTemps);
    const { svg, matrixWidth, matrixHeight } = createMatrixView(processed, mode);

    const colorScale = d3.scaleSequential(d3.interpolateRdYlBu).domain([40, 0]);

    const legendGroup = svg
      .append("g")
      .attr("transform", `translate(${matrixWidth + 20}, ${matrixHeight})`);

    createLegend(legendGroup, colorScale);
  });
}

init();
