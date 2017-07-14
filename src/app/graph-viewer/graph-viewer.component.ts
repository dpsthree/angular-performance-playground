import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { SimulationLinkDatum } from 'd3-force';

import { D3HelperService, GraphNode } from '../d3-helper.service';

@Component({
  selector: 'app-graph-viewer',
  templateUrl: './graph-viewer.component.html',
  styleUrls: ['./graph-viewer.component.css']
})
export class GraphViewerComponent implements AfterViewChecked {

  relationships: SimulationLinkDatum<GraphNode>[];
  entities: GraphNode[];
  private domInitialized = false;
  @ViewChild('svgEle') svgElement: ElementRef;

  constructor(private d3Helper: D3HelperService) {
    d3Helper.linksAndNodes.subscribe(({ relationships, entities }) => {
      this.relationships = relationships;
      this.entities = entities;
    })
    window.addEventListener('resize', () => {
      d3Helper.updateSize({
        height: this.svgElement.nativeElement.clientHeight,
        width: this.svgElement.nativeElement.clientWidth
      });
    });
  }
  ngAfterViewChecked() {
    if (!this.domInitialized) {

      this.d3Helper.updateSize({
        height: this.svgElement.nativeElement.clientHeight,
        width: this.svgElement.nativeElement.clientWidth
      })
    }
    this.domInitialized = true;
  }

  relationshipSelected(rel: SimulationLinkDatum<GraphNode>) {
    console.log('relationships selected', rel);
  }

  entitySelected(entity: GraphNode) {
    console.log('node selected', entity);
  }
}
