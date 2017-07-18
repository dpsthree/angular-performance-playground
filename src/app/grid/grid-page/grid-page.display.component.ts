import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DataSource } from '@angular/cdk';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { FormControl } from '@angular/forms';
import { SimulationLinkDatum } from 'd3';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';

import { GraphNode } from '../../d3-helper.service';
@Component({
  selector: 'app-grid-page-display',
  templateUrl: './grid-page.display.component.html',
  styleUrls: ['./grid-page.display.component.css']
})

export class GridPageDisplayComponent {
  @Input() set entities(value: { entities: GraphNode[], relationships: SimulationLinkDatum<GraphNode>[] }) {
    if (value && value.entities) {
      this.exampleDatabase.updateEntities(value.entities);
    }
  };
  displayedColumns = ['displayName', 'xPos', 'yPos', 'color'];
  exampleDatabase = new ExampleDatabase();
  dataSource: ExampleDataSource | null;
  filter: FormControl = new FormControl();

  constructor() {
    this.dataSource = new ExampleDataSource(this.exampleDatabase);
    this.filter.valueChanges
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe((value) => {
        if (!this.dataSource) { return; }
        this.dataSource.filter = value;
      });
  }
}

export interface UserData {
  index?: number;
  displayName: string;
  x?: number;
  y?: number;
  color: string;
  [key: string]: any;
}

/** An example database that the data source uses to retrieve data for the table. */
export class ExampleDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange = new BehaviorSubject<UserData[]>([]);
  get data(): UserData[] { return this.dataChange.value; }

  constructor() {
  }

  /** Adds a new user to the database. */
  updateEntities(entities: GraphNode[]) {
    this.dataChange.next(entities);
  }
}

export class ExampleDataSource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

  constructor(private _exampleDatabase: ExampleDatabase) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<UserData[]> {
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._filterChange,
    ];

    return Observable.merge(...displayDataChanges)
      .map(() => {
      return this._exampleDatabase.data.slice().filter((item: UserData) => {
        const searchStr = item.displayName.toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      });
    });
  }

  disconnect() { }
}
