import { Component } from '@angular/core';

import { D3HelperService } from '../../d3-helper.service';
@Component({
  selector: 'app-grid-page',
  templateUrl: './grid-page.component.html',
  styleUrls: ['./grid-page.component.css']
})
export class GridPageComponent {
  entities = this.d3Helper.linksAndNodes;
  constructor(private d3Helper: D3HelperService) { }
}
