import { Component } from '@angular/core';
import { SimulationLinkDatum } from 'd3-force';

import { D3HelperService, GraphNode } from '../d3-helper.service';

@Component({
  selector: 'app-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.css']
})
export class PeopleListComponent {
  relationships: SimulationLinkDatum<GraphNode>[];
  entities: {entity: GraphNode, relCount: number}[];

  constructor(private d3Helper: D3HelperService) {
    d3Helper.entitiesAndDetails.subscribe( list => {
      this.entities = list;
    })
  }
}
