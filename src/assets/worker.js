importScripts("https://d3js.org/d3-collection.v1.min.js");
importScripts("https://d3js.org/d3-dispatch.v1.min.js");
importScripts("https://d3js.org/d3-quadtree.v1.min.js");
importScripts("https://d3js.org/d3-timer.v1.min.js");
importScripts("https://d3js.org/d3-force.v1.min.js");

onmessage = function (event) {
  var entities = event.data.entities,
    relationships = event.data.relationships,
    width = event.data.width,
    height = event.data.height,
    id = event.data.id;


  var simulation = d3.forceSimulation(entities)
    .force('charge', d3.forceManyBody().strength(-30))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('x', d3.forceX())
    .force('y', d3.forceY())
    .alphaMin(.0001)
    .alphaDecay(0.0005)
    .on('tick', () => {
      postMessage({ relationships, entities, id });
    })
    .force('link', d3.forceLink(relationships)
      .distance(0).strength(.5));
};