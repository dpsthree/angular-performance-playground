import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SimulationLinkDatum } from 'd3-force';
import { Observable } from 'rxjs/Observable';

import { D3HelperService, GraphNode } from '../d3-helper.service';

@Component({
  selector: 'app-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeopleListComponent {
  entities: Observable<{ entity: GraphNode, relCount: number }[]>;
  search = this.d3Helper.searchValue;
  constructor(private d3Helper: D3HelperService) {
    this.entities = d3Helper.entitiesAndDetails;
  }

  searchChanged(value: string) {
    this.d3Helper.updateSearch(value);
  }
}
