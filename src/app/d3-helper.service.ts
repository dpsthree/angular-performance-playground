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
import 'rxjs/add/operator/shareReplay'
import 'rxjs/add/operator/distinctUntilChanged'
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
  color: string;
}

const NODE_COUNT = 700;
const LOWER_CHARGE = 0;
const UPPER_CHARGE = -100;
const colorList = [
  '#1565c0',
  '#5e92f3',
  '#003c8f',
  '#e91e63',
  '#ff6090',
  '#b0003a'
]

@Injectable()
export class D3HelperService {
  // Force ticked outgoing streams of data
  private graphData: Subject<{ relationships: SimulationLinkDatum<GraphNode>[], entities: GraphNode[] }> = new Subject();
  linksAndNodes = this.graphData.shareReplay();
  entitiesAndDetails: Observable<{ entity: GraphNode, relCount: number }[]>;

  private forceSimulation: Simulation<GraphNode, SimulationLinkDatum<GraphNode>>;
  private sizes: BehaviorSubject<{ width: number, height: number }> = new BehaviorSubject({ width: 100, height: 100 });
  private charge = LOWER_CHARGE;
  private centers: { width: number, height: number }[] = [];

  constructor() {
    const generatedNodes: GraphNode[] = []
    for (let i = 0; i < NODE_COUNT; i++) {
      generatedNodes.push({ displayName: faker.name.findName(), index: i, color: colorList[Math.floor(Math.random() * 6)] });
    }

    const generatedLinks: SimulationLinkDatum<GraphNode>[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      let found = false;
      const source: GraphNode = generatedNodes[i];
      let target: GraphNode;
      do {
        target = generatedNodes[Math.floor(Math.random() * NODE_COUNT)];
        found = !!_.find(generatedLinks, link => {
          return (
            link.source === source && link.target === target ||
            link.source === target && link.target === source ||
            source === target
          );
        })
      } while (found)
      generatedLinks.push({ source, target });
    }

    this.sizes.subscribe(({ width, height }) => {
      this.updateForce(generatedNodes, generatedLinks, height, width);
    })

    this.entitiesAndDetails = this.linksAndNodes
      // Big performance bump on this line
      .distinctUntilChanged(_.isEqual)
      .map(relsAndEnts => {
        const entDetails: { entity: GraphNode, relCount: number }[] = [];
        relsAndEnts.entities.forEach(entity => {
          const rels = relsAndEnts.relationships.filter(rel => rel.source === entity || rel.target === entity);
          entDetails.push({ entity, relCount: rels.length });
        })
        return entDetails;
      }).distinctUntilChanged(_.isEqual)
      .shareReplay();

    setInterval(() => {
      this.forceSimulation.force('charge', forceManyBody().strength(this.charge))
      this.charge--;
      if (this.charge < UPPER_CHARGE) {
        this.charge = LOWER_CHARGE;
      }
      this.forceSimulation
        .alpha(.01)
        .restart();
    }, 500)
  }

  updateSize(newSize: { height: number, width: number }) {
    this.sizes.next(newSize);
  }

  // Creates a new force directed graph
  // pushes a new array to relationships and entities
  updateForce(entities: GraphNode[], relationships: SimulationLinkDatum<GraphNode>[], height: number, width: number) {
    this.forceSimulation = forceSimulation(entities)
      .force('charge', forceManyBody().strength(-10))
      .force('center', forceCenter(width / 2, height / 2))
      .force('x', forceX())
      .force('y', forceY())
      .alphaMin(.001)
      .on('tick', () => {
        this.graphData.next({ relationships: [...relationships], entities: [...entities] });
      })
      .force('link', forceLink(relationships)
        .distance(0).strength(.5));
  }
}
