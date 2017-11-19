import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { SimulationLinkDatum } from 'd3-force';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { MatSliderChange } from '@angular/material';

import { D3HelperService, GraphNode } from '../../../d3-helper.service';

@Component({
  selector: 'app-people-list-display',
  templateUrl: './people-list.display.component.html',
  styleUrls: ['./people-list.display.component.css'],
  // Only run change detection with entities or search changes
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeopleListDisplayComponent implements OnDestroy {
  // The list of people to display, presorted
  @Input() entities: { entity: GraphNode, relCount: number }[];

  // The search string and people count, if it is changed by means other than the form control
  // this will keep the form in sync
  @Input() set search(value: string) {
    this.searchControl.setValue(value, { emitEvent: false });
  };

  @Input() count: number;

  // Sends control value changes out for handling
  @Output() searchChanged = new EventEmitter<string>();
  @Output() countChanged = new EventEmitter<number>();

  searchControl = new FormControl();

  // Handle for control changes so that it can be disposed of properly
  searchChangedSub: Subscription;

  // used in template to help angular identify unique entities, reduces
  // the amount of DOM updating needed
  trackEntsBy(index, entry: { entity: GraphNode, relCount: number }) {
    return entry.entity && entry.entity.displayName;
  }

  constructor() {
    this.searchChangedSub = this.searchControl.valueChanges.subscribe(value => this.searchChanged.emit(value));
  }

  ngOnDestroy() {
    this.searchChangedSub.unsubscribe();
  }

  updateCount(slider: MatSliderChange) {
    this.countChanged.emit(slider.value);
  }
}
