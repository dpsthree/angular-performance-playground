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
  entities: GraphNode[];

  constructor(private d3Helper: D3HelperService) {
    d3Helper.linksAndNodes.subscribe(({ relationships, entities }) => {
      this.relationships = relationships;
      this.entities = entities;
    })
  }
}
