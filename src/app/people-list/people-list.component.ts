import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { D3HelperService, GraphNode } from '../d3-helper.service';

@Component({
  selector: 'app-people-list',
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.css'],
  // Don't run change detection on this component
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeopleListComponent {
  entities: Observable<{ entity: GraphNode, relCount: number }[]> = this.d3Helper.entitiesAndDetails;
  search = this.d3Helper.searchValue;
  constructor(private d3Helper: D3HelperService) {}

  searchChanged(value: string) {
    this.d3Helper.updateSearch(value);
  }
}
