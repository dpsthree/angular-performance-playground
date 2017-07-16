import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { SimulationLinkDatum } from 'd3-force';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { D3HelperService, GraphNode } from '../d3-helper.service';

@Component({
  selector: 'app-people-list-display',
  templateUrl: './people-list.display.component.html',
  styleUrls: ['./people-list.display.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeopleListDisplayComponent implements OnDestroy {
  @Input() entities: { entity: GraphNode, relCount: number }[];
  @Input() set search(value: string) {
    this.searchControl.setValue(value, { emitEvent: false });
  };
  @Output() searchChanged = new EventEmitter<string>();
  searchControl = new FormControl();
  searchChangedSub: Subscription;

  trackEntsBy(index, entry: { entity: GraphNode, relCount: number }) {
    return entry.entity && entry.entity.displayName;
  }

  constructor() {
    this.searchChangedSub = this.searchControl.valueChanges.subscribe(value => this.searchChanged.emit(value));
  }

  ngOnDestroy() {
    this.searchChangedSub.unsubscribe();
  }
}
