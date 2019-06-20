/// <reference lib="webworker" />
import {
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceX,
  forceY,
  forceLink
} from 'd3-force';
import { find } from 'lodash';

// This data should persist between messages
let simulation, entities, relationships;
let filteredEntities, filteredRelationships;
onmessage = function(event) {
  // Unpack the various bits of data
  // Search and type are used on every message
  const search = event.data.search;
  const type = event.data.type;
  // The following will recreate the simulation
  // It also creates new values for most of the persistant data
  if (type && type === 'restart') {
    entities = event.data.entities;
    relationships = event.data.relationships;
    const width = event.data.width;
    const height = event.data.height;
    // We need d3 to associate the links with nodes before filtering
    filteredEntities = undefined;
    filteredRelationships = undefined;
    // Create a new simulation and return the results each tick
    // of the force calculation
    // See d3 force simulation documentation for more details
    // (https://github.com/d3/d3-force)

    simulation = forceSimulation(entities)
      .force('charge', forceManyBody().strength(-30))
      .force('center', forceCenter(width / 2, height / 2))
      .force('x', forceX())
      .force('y', forceY())
      .alphaMin(0.0001)
      .alphaDecay(0.0005)
      .on('tick', function() {
        // Now that d3 has moved the node objects into the links perform a filter
        // but only once
        if (!filteredEntities) {
          filteredEntities = entities.filter(function(ent) {
            return ent.displayName.indexOf(search) > -1;
          });
          filteredRelationships = relationships.filter(function(rel) {
            return (
              find(filteredEntities, function(ent) {
                return ent === rel.source;
              }) &&
              find(filteredEntities, function(ent) {
                return ent === rel.target;
              })
            );
          });
        }
        // Return the results to the client
        postMessage({
          relationships: filteredRelationships,
          entities: filteredEntities
        });
        if (simulation) {
          simulation.stop();
        }
      })
      .force(
        'link',
        forceLink(relationships)
          .id(function(node) {
            return (node as any).displayName;
          })
          .distance(0)
          .strength(0.5)
      );
    simulation.tick();
  }
  // When searching we want to continue forcing as usual, but we want to narrow the set
  // that is returned to the client
  if (type && type === 'filter') {
    filteredEntities = entities.filter(function(ent) {
      return ent.displayName.indexOf(search) > -1;
    });
    filteredRelationships = relationships.filter(function(rel) {
      return (
        find(filteredEntities, function(ent) {
          return ent === rel.source;
        }) &&
        find(filteredEntities, function(ent) {
          return ent === rel.target;
        })
      );
    });
  }
  if (type && type === 'tick') {
    simulation.restart();
  }
};
