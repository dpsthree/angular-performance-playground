import { Component, ChangeDetectionStrategy } from '@angular/core';

import { D3HelperService } from '../../d3-helper.service';
@Component({
  selector: 'app-grid-page',
  templateUrl: './grid-page.component.html',
  styleUrls: ['./grid-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridPageComponent {
  entities = this.d3Helper.entitiesAndDetails;
  count = this.d3Helper.countValue;

  constructor(private d3Helper: D3HelperService) {}

  countChanged(value: number) {
    this.d3Helper.updateCount(value);
  }
}
