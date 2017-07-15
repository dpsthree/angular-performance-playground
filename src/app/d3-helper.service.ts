import { Injectable } from '@angular/core';
import {
  forceSimulation,
  Simulation,
  SimulationNodeDatum,
  SimulationLinkDatum,
  forceManyBody,
  forceCenter,
  forceX,
  forceY,
  forceLink
} from 'd3-force';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import * as faker from 'faker';

/**
 * Used to abstract the complexities and concerns of D3
 *
 * The primary responsibility is to expose an observable collection of
 * entities and their relationships, a list of hovered and selected entities and any other data
 * needed to drive visualization components.
 */

/**
 * The following interface is used to represent an entity
 * after it has passed through the d3 force algorithm. This type
 * should ideally be used only along the critical path of displaying
 * a network graph or consuming its events.
 */
export interface GraphNode extends SimulationNodeDatum {
  displayName: string;
}

const NODE_COUNT = 500;
const LINK_COUNT = NODE_COUNT / 2;

@Injectable()
export class D3HelperService {
  // Force ticked outgoing streams of data
  linksAndNodes: Subject<{ relationships: SimulationLinkDatum<GraphNode>[], entities: GraphNode[] }> = new Subject();

  private forceSimulation: Simulation<GraphNode, SimulationLinkDatum<GraphNode>>;
  private sizes: BehaviorSubject<{ width: number, height: number }> = new BehaviorSubject({ width: 100, height: 100 });

  constructor() {
    const generatedNodes: GraphNode[] = []
    for (let i = 0; i < NODE_COUNT; i++) {
      generatedNodes.push({ displayName: faker.name.findName(), index: i });
    }

    const generatedLinks: SimulationLinkDatum<GraphNode>[] = [];
    for (let i = 0; i < LINK_COUNT; i = generatedLinks.length) {
      const source = generatedNodes[Math.floor(Math.random() * LINK_COUNT)];
      const target = generatedNodes[Math.floor(Math.random() * LINK_COUNT)];
      if (!_.find(generatedLinks, link => {
        return (
          link.source === source && link.target === target ||
          link.source === target && link.target === source
        );
      })) {
        generatedLinks.push({ source, target });
      }
    }

    this.sizes.subscribe(({ width, height }) => {
      this.updateForce(generatedNodes, generatedLinks, height, width);
    })
  }

  updateSize(newSize: { height: number, width: number }) {
    this.sizes.next(newSize);
  }

  // Creates a new force directed graph
  // pushes a new array to relationships and entities
  updateForce(entities: GraphNode[], relationships: SimulationLinkDatum<GraphNode>[], height: number, width: number) {
    this.forceSimulation = forceSimulation(entities)
      .force('charge', forceManyBody().strength(-25))
      .force('center', forceCenter(width / 2, height / 2))
      .force('x', forceX())
      .force('y', forceY())
      .alphaMin(.001)
      .on('tick', () => {
        this.linksAndNodes.next({ relationships: [...relationships], entities: [...entities] });
      })
      .force('link', forceLink(relationships)
        // .id((node: GraphNode) => node.index.toString())
        .distance(0).strength(1));
  }
}
