import { Injectable, ApplicationRef } from '@angular/core';
import { Http } from '@angular/http';
import { SimulationNodeDatum, SimulationLinkDatum } from 'd3-force';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

const entityEndPoint = 'https://us-central1-angular-performance-playground.cloudfunctions.net/helloWorld';
/**
 * Used to abstract the complexities and concerns of D3
 *
 * The primary responsibility is to expose an observable collection of
 * entities and their relationships and any other data
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

const INITIAL_NODE_COUNT = 250;

@Injectable()
export class D3HelperService {
  // Hold the internal representation of the data
  // Updates from the force calculation are pushed into this
  private graphData: Subject<{ relationships: SimulationLinkDatum<GraphNode>[], entities: GraphNode[] }> = new Subject();

  // Observable form of the graphs bounding box
  private sizes: BehaviorSubject<{ width: number, height: number }> = new BehaviorSubject({ width: 100, height: 100 });

  // Webworker that contains the force calculation algorithm
  private worker = new Worker('worker.js');

  // Data as it arrives from the server
  private serverData: Observable<{ entities: GraphNode[], relationships: SimulationLinkDatum<GraphNode>[] }>;

  // Throttle Updates so as not to overwhelm change detection cycles
  linksAndNodes = this.graphData;

  // The holds the data that has passed through the family calculations
  entitiesAndDetails: Observable<{ entity: GraphNode, relCount: number }[]>;

  // Holds the user supplied search term
  searchValue = new BehaviorSubject('');

  // Number of nodes and links to fetch as a number
  countValue = new BehaviorSubject(INITIAL_NODE_COUNT);

  constructor(private ar: ApplicationRef, http: Http) {

    // Grab the data from the server
    this.serverData = this.countValue
      .switchMap(count => http.post(entityEndPoint, { data: { count } })
        .map(res => res.json())).map(data => data.result).publishReplay().refCount();

    // After sending data downstream inform Angular that an event happened outside of zones
    this.worker.onmessage = (event => {
      requestAnimationFrame(() => {
        this.worker.postMessage({ type: 'tick' });
        this.graphData.next({ entities: event.data.entities, relationships: event.data.relationships });
        this.ar.tick();
      });
    });

    // Watch for both the http result to arrive and the current graph size to submit a new
    // data set for force calculations
    Observable.combineLatest(
      this.serverData,
      this.sizes
    ).withLatestFrom(
      // We also want to consider the latest search value but we don't want a search update
      // to trigger a restart of the graph
      this.searchValue,
      ([{ entities, relationships }, { width, height }], search) => {
        this.updateForce(entities, relationships, height, width, search);
      }).subscribe();

    // Given data and search value, combine them together to produce a filtered list containing
    // the family calculation
    this.entitiesAndDetails = Observable.combineLatest(
      this.serverData
        .map(relsAndEnts => {
          const entDetails: { entity: GraphNode, relCount: number }[] = [];
          relsAndEnts.entities.forEach(entity => {
            // Find out how many first level connections this entity has
            const rels = relsAndEnts.relationships
              .filter(rel => rel.source === entity.displayName || rel.target === entity.displayName);
            entDetails.push({ entity, relCount: rels.length });
          });
          return entDetails;
        }),
      this.searchValue,
      (entDetails, search) => entDetails.filter(ent => ent.entity.displayName.indexOf(search) > -1))
      .do(data => console.log('testing do', data));
  }

  // Submit a new search value down the pipeline
  updateSearch(value: string) {
    this.searchValue.next(value);
    this.worker.postMessage({ search: value, type: 'filter' });
  }

  // Submit a new graph size down the pipeline
  updateSize(newSize: { height: number, width: number }) {
    this.sizes.next(newSize);
  }

  // Request a new data set
  updateCount(count: number) {
    this.countValue.next(count);
  }

  // Fires up a new web worker thread to obtain force calculations
  updateForce(entities: GraphNode[], relationships: SimulationLinkDatum<GraphNode>[], height: number, width: number, search: string) {
    this.worker.postMessage({ entities, relationships, height, width, search, type: 'restart' });
    this.worker.postMessage({ type: 'tick' });
  }
}
