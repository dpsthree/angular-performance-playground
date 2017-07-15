import { Component, Input, ViewChild, ElementRef, AfterViewChecked, ChangeDetectionStrategy } from '@angular/core';
import { SimulationLinkDatum } from 'd3-force';

import { D3HelperService, GraphNode } from '../d3-helper.service';

@Component({
  selector: 'app-graph-viewer-display',
  templateUrl: './graph-viewer.display.component.html',
  styleUrls: ['./graph-viewer.display.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraphViewerDisplayComponent implements AfterViewChecked {
  @Input() relationships: SimulationLinkDatum<GraphNode>[];
  @Input() entities: GraphNode[];
  @ViewChild('svgEle') svgElement: ElementRef;

  private domInitialized = false;

  constructor(private d3Helper: D3HelperService) {
    window.addEventListener('resize', () => {
      d3Helper.updateSize({
        height: this.svgElement.nativeElement.clientHeight,
        width: this.svgElement.nativeElement.clientWidth
      });
    });
  }

  trackLineBy(index: number, line: SimulationLinkDatum<GraphNode>) {
    const source: GraphNode = line.source as GraphNode;
    const target: GraphNode = line.target as GraphNode;
    return source.displayName + target.displayName;
  }

  trackEntsBy(index: number, entry: GraphNode) {
    return entry.displayName;
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
}
