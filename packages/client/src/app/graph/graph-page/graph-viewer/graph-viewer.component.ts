import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SimulationLinkDatum } from 'd3-force';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { D3HelperService, GraphNode } from '../../../d3-helper.service';

@Component({
  selector: 'app-graph-viewer',
  templateUrl: './graph-viewer.component.html',
  styleUrls: ['./graph-viewer.component.css'],
  // No change detection here (no inputs)
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraphViewerComponent {
  relationships: Observable<SimulationLinkDatum<GraphNode>[]>;
  entities: Observable<GraphNode[]>;

  constructor(d3Helper: D3HelperService) {
    // Reduce the relationships and entities to their individual pieces
    this.relationships = d3Helper.linksAndNodes.pipe(
      map(({ relationships }) => relationships)
    );

    this.entities = d3Helper.linksAndNodes.pipe(
      map(({ entities }) => entities)
    );
  }
}
