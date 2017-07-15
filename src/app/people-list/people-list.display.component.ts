import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { SimulationLinkDatum } from 'd3-force';

import { D3HelperService, GraphNode } from '../d3-helper.service';

@Component({
  selector: 'app-people-list-display',
  templateUrl: './people-list.display.component.html',
  styleUrls: ['./people-list.display.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeopleListDisplayComponent {
  @Input() entities: { entity: GraphNode, relCount: number }[];

  trackEntsBy(index, entry: { entity: GraphNode, relCount: number }) {
    return entry.entity && entry.entity.displayName;
  }
}
