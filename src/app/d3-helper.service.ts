import { Injectable, ApplicationRef } from '@angular/core';
import { Http } from '@angular/http';
import { SimulationNodeDatum, SimulationLinkDatum } from 'd3-force';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import 'rxjs/add/operator/take'
import 'rxjs/add/operator/throttleTime'
import 'rxjs/add/observable/combineLatest'

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

@Injectable()
export class D3HelperService {
  // Hold the internal representation of the data
  // Updates from the force calculation are pushed into this
  private graphData: Subject<{ relationships: SimulationLinkDatum<GraphNode>[], entities: GraphNode[] }> = new Subject();

  // Observable form of the graphs bounding box
  private sizes: BehaviorSubject<{ width: number, height: number }> = new BehaviorSubject({ width: 100, height: 100 });

  // Webworker that contains the force calculation algorithm
  private worker = new Worker('assets/worker.js');

  // ID used to track results from webworkers
  // We are only interested in one result set at a time
  private id = 0;

  // Throttle Updates so as not to overwhelm change detection cycles
  linksAndNodes = this.graphData.throttleTime(15);

  // The holds the data that has passed through the family calculations
  entitiesAndDetails: Observable<{ entity: GraphNode, relCount: number }[]>;

  // Holds the user supplied search term
  searchValue = new BehaviorSubject('');

  constructor(private ar: ApplicationRef, http: Http) {
    // When the worker sends up a new message make sure
    // that it is from the latest data set. If so, send the results downstream
    // finally, inform Angular that an event happened outside of zones
    this.worker.onmessage = (event => {
      if (this.id === event.data.id) {
        this.graphData.next({ entities: event.data.entities, relationships: event.data.relationships });
        this.ar.tick();
      }
    })

    // Watch for both the http result to arrive and the current graph size to submit a new
    // data set for force calculations
    Observable.combineLatest(http.get('/v1/details').map(res => res.json()), this.sizes,
      ({ entities, relationships }, { width, height }) => {
        this.updateForce(entities, relationships, height, width);
      }).subscribe();

    // Given data and search value, combine them together to produce a filtered list containing
    // the family calculation
    this.entitiesAndDetails = Observable.combineLatest(this.linksAndNodes
      // Big performance bump on this line
      .take(1)
      .map(relsAndEnts => {
        const entDetails: { entity: GraphNode, relCount: number }[] = [];
        relsAndEnts.entities.forEach(entity => {
          // Find out how many first level connections this entity has
          const rels = relsAndEnts.relationships.filter(rel => rel.source === entity || rel.target === entity);
          entDetails.push({ entity, relCount: rels.length });
        })
        return entDetails;
      }),
      this.searchValue,
      (entDetails, search) => entDetails.filter(ent => ent.entity.displayName.indexOf(search) > -1))
  }

  // Submit a new search value down the pipeline
  updateSearch(value: string) {
    this.searchValue.next(value);
  }

  // Submit a new graph size down the pipeline
  updateSize(newSize: { height: number, width: number }) {
    this.sizes.next(newSize);
  }

  // Fires up a new web worker thread to obtain force calculations
  updateForce(entities: GraphNode[], relationships: SimulationLinkDatum<GraphNode>[], height: number, width: number) {
    this.id++;
    this.worker.postMessage({ entities, relationships, height, width, id: this.id })
  }
}
