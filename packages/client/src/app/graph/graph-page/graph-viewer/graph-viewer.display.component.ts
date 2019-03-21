import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { SimulationLinkDatum } from 'd3-force';

import { D3HelperService, GraphNode } from '../../../d3-helper.service';

@Component({
  selector: 'app-graph-viewer-display',
  templateUrl: './graph-viewer.display.component.svg',
  styleUrls: ['./graph-viewer.display.component.css'],
  // Only run change detection when inputs change
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraphViewerDisplayComponent implements OnInit {
  @Input() relationships: SimulationLinkDatum<GraphNode>[];
  @Input() entities: GraphNode[];

  // Grab a reference to the SVG DOM element
  // We'll use this below for determining force graph centering
  @ViewChild('svgEle') svgElement: ElementRef;

  constructor(private d3Helper: D3HelperService) {
    // Once this component is created tell the browser that
    // we would like to be informed of browser resize events

    // When a browser resize event occurs
    // inform the d3Helper that we are going to need a new force layout
    window.addEventListener('resize', () => {
      this.updateSize();
    });
  }

  // Help Angular detect changes by providing a unique identifier for links
  trackLineBy(_index: number, line: SimulationLinkDatum<GraphNode>) {
    const source: GraphNode = line.source as GraphNode;
    const target: GraphNode = line.target as GraphNode;
    return source.displayName + target.displayName;
  }

  // Help Angular detect changes by providing a unique identifier for nodes
  trackEntsBy(_index: number, entry: GraphNode) {
    return entry.displayName;
  }

  // Executed once to setup graph position, then again on window resize
  updateSize() {
    const nativeElement = this.svgElement.nativeElement;
    this.d3Helper.updateSize({
      height:
        nativeElement.clientHeight || nativeElement.parentNode.clientHeight,
      width: nativeElement.clientWidth || nativeElement.parentNode.clientWidth
    });
  }
  // Runs each time the view is checked
  // Using it here because there is work todo after the first render
  // Careful here, this can be a performance hit

  // The first time the view is checked we know that it is safe
  // To inquire about the initial height and width of the SVG graph
  // Do so and inform the d3Helper
  ngOnInit() {
    this.updateSize();
  }
}
