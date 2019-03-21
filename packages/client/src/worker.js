"use strict";
// Grab pre-bundled d3 ready to use
importScripts('d3-collection.min.js');
importScripts('d3-dispatch.min.js');
importScripts('d3-quadtree.min.js');
importScripts('d3-timer.min.js');
importScripts('d3-force.min.js');
importScripts('lodash.min.js');
var simulation, entities, relationships;
var filteredEntities, filteredRelationships;
onmessage = function (event) {
    // Unpack the various bits of data
    // Search and type are used on every message
    var search = event.data.search;
    var type = event.data.type;
    // The following will recreate the simulation
    // It also creates new values for most of the persistant data
    if (type && type === 'restart') {
        entities = event.data.entities;
        relationships = event.data.relationships;
        var width = event.data.width;
        var height = event.data.height;
        // We need d3 to associate the links with nodes before filtering
        filteredEntities = undefined;
        filteredRelationships = undefined;
        // Create a new simulation and return the results each tick
        // of the force calculation
        // See d3 force simulation documentation for more details
        // (https://github.com/d3/d3-force)
        simulation = d3
            .forceSimulation(entities)
            .force('charge', d3.forceManyBody().strength(-30))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('x', d3.forceX())
            .force('y', d3.forceY())
            .alphaMin(0.0001)
            .alphaDecay(0.0005)
            .on('tick', function () {
            // Now that d3 has moved the node objects into the links perform a filter
            // but only once
            if (!filteredEntities) {
                filteredEntities = entities.filter(function (ent) {
                    return ent.displayName.indexOf(search) > -1;
                });
                filteredRelationships = relationships.filter(function (rel) {
                    return (_.find(filteredEntities, function (ent) {
                        return ent === rel.source;
                    }) &&
                        _.find(filteredEntities, function (ent) {
                            return ent === rel.target;
                        }));
                });
            }
            // Return the results to the client
            postMessage({
                relationships: filteredRelationships,
                entities: filteredEntities,
            });
            if (simulation) {
                simulation.stop();
            }
        })
            .force('link', d3
            .forceLink(relationships)
            .id(function (node) {
            return node.displayName;
        })
            .distance(0)
            .strength(0.5));
        simulation.tick();
    }
    // When searching we want to continue forcing as usual, but we want to narrow the set
    // that is returned to the client
    if (type && type === 'filter') {
        filteredEntities = entities.filter(function (ent) {
            return ent.displayName.indexOf(search) > -1;
        });
        filteredRelationships = relationships.filter(function (rel) {
            return (_.find(filteredEntities, function (ent) {
                return ent === rel.source;
            }) &&
                _.find(filteredEntities, function (ent) {
                    return ent === rel.target;
                }));
        });
    }
    if (type && type === 'tick') {
        simulation.restart();
    }
};
//# sourceMappingURL=worker.js.map