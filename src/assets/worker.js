// Not terribly familiar with web workers
// There is likely a better way to do this.
// Perhaps a shared worker would have been better?

// Grab pre-bundled d3 ready to use
importScripts("https://d3js.org/d3-collection.v1.min.js");
importScripts("https://d3js.org/d3-dispatch.v1.min.js");
importScripts("https://d3js.org/d3-quadtree.v1.min.js");
importScripts("https://d3js.org/d3-timer.v1.min.js");
importScripts("https://d3js.org/d3-force.v1.min.js");

// The following is called each time the size of the SVG graph
// changes in the main process
onmessage = function (event) {

  // Unpack the various bits of data
  var entities = event.data.entities,
    relationships = event.data.relationships,
    width = event.data.width,
    height = event.data.height,
    // Return with every postMessage so that the caller knows
    // which response is associated with which input
    id = event.data.id;

  // Create a new simulation and return the results each tick
  // of the force calculation
  // See d3 force simulation documentation for more details
  // (https://github.com/d3/d3-force)
  var simulation = d3.forceSimulation(entities)
    .force('charge', d3.forceManyBody().strength(-30))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('x', d3.forceX())
    .force('y', d3.forceY())
    // really low alpha min and decay result in long running
    // force graph, good for ambient motion during presentation
    .alphaMin(.0001)
    .alphaDecay(0.0005)
    .on('tick', () => {
      postMessage({ relationships: [...relationships], entities: [...entities], id });
    })
    .force('link', d3.forceLink(relationships)
      // Associate links with nodes by way of display name  
      .id(node => node.displayName)  
      .distance(0).strength(.5));
};