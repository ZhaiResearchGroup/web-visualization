// code modified from: https://bl.ocks.org/mbostock/4062045
import * as d3 from 'd3';

document.addEventListener('DOMContentLoaded', () => {
  // fetch('/data')
  //   .then(res => res.json())
  //   .then(data => visualizeGraph(data));
  const data = {
    nodes: [
      {id: "1"},
      {id: "2"},
      {id: "3"},
    ],
    edges: [
      {source: "1", target: "2"},
      {source: "2", target: "3" },
      {source: "1", target: "3"},
    ],
  };
  visualizeGraph(data);
});

const visualizeGraph = (data) => {
  // == BOILERPLATE ==
  const margin = { top: 50, right: 50, bottom: 50, left: 120 },
     width = 800 - margin.left - margin.right,
     height = (10 * 20);

  const svg = d3.select("#vis")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .style("width", width + margin.left + margin.right)
                .style("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const simulation = d3.forceSimulation()
                        .force("link", d3.forceLink().id((d) => {
                           return d.id;
                         }))
                        .force("charge", d3.forceManyBody())
                        .force("center", d3.forceCenter(width / 2, height / 2));

  // visualization starts here
  const node = svg.append("g")
                  .attr("class", "nodes")
                  .selectAll("circle")
                  .data(data.nodes)
                  .enter()
                  .append("circle")
                  .attr("r", 5)
                  .attr("fill", "red")
                  .call(d3.drag()
                          .on("start", dragstarted)
                          .on("drag", dragged)
                          .on("end", dragended));

  const edge = svg.append("g")
                  .attr("class", "edges")
                  .selectAll("line")
                  .data(data.edges)
                  .enter()
                  .append("line")
                  .attr("stroke-width", 1);

  simulation
      .nodes(data.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(data.edges);

  function ticked() {
    edge
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  }

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}
