import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SimulationLinkDatum } from 'd3-force';
import { Observable } from 'rxjs/Observable';

import { D3HelperService, GraphNode } from '../d3-helper.service';

@Component({
  selector: 'app-graph-viewer',
  templateUrl: './graph-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraphViewerComponent {

  relationships: Observable<SimulationLinkDatum<GraphNode>[]>;
  entities: Observable<GraphNode[]>;

  constructor(private d3Helper: D3HelperService) {
    this.relationships = d3Helper.linksAndNodes.map(({ relationships, entities }) => relationships);
    this.entities = d3Helper.linksAndNodes.map(({ relationships, entities }) => entities);
  }
}
