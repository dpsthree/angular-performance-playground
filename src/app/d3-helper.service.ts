import { Injectable, ApplicationRef } from '@angular/core';
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
import 'rxjs/add/operator/take'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/throttleTime'
import 'rxjs/add/operator/distinctUntilChanged'
import 'rxjs/add/observable/combineLatest'
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

const NODE_COUNT = 500;
const LOWER_CHARGE = -0;
const UPPER_CHARGE = -75;
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
  private graphData: Subject<{ relationships: SimulationLinkDatum<GraphNode>[], entities: GraphNode[] }> = new Subject();
  private sizes: BehaviorSubject<{ width: number, height: number }> = new BehaviorSubject({ width: 100, height: 100 });
  private worker = new Worker('assets/worker.js');
  private id = 0;
  // Force ticked outgoing streams of data
  linksAndNodes = this.graphData.throttleTime(30);
  entitiesAndDetails: Observable<{ entity: GraphNode, relCount: number }[]>;
  searchValue = new BehaviorSubject('');

  constructor(private ar: ApplicationRef) {
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

    this.worker.onmessage = (event => {
      if (this.id === event.data.id) {
        this.graphData.next({ entities: event.data.entities, relationships: event.data.relationships });
        this.ar.tick();
      }
    })

    this.sizes.subscribe(({ width, height }) => {
      this.updateForce(generatedNodes, generatedLinks, height, width);
    })

    this.entitiesAndDetails = this.linksAndNodes
      // Big performance bump on this line
      .take(1)
      .map(relsAndEnts => {
        const entDetails: { entity: GraphNode, relCount: number }[] = [];
        relsAndEnts.entities.forEach(entity => {
          const rels = relsAndEnts.relationships.filter(rel => rel.source === entity || rel.target === entity);
          entDetails.push({ entity, relCount: rels.length });
        })
        return entDetails;
      })
  }

  updateSearch(value: string) {
    this.searchValue.next(value);
  }

  updateSize(newSize: { height: number, width: number }) {
    this.sizes.next(newSize);
  }

  // Creates a new force directed graph
  // pushes a new array to relationships and entities
  updateForce(entities: GraphNode[], relationships: SimulationLinkDatum<GraphNode>[], height: number, width: number) {
    this.id++;
    this.worker.postMessage({ entities, relationships, height, width, id: this.id })
  }
}
