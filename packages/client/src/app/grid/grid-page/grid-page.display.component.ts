import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  ViewChild,
  EventEmitter,
  OnInit
} from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { MatSort, MatSliderChange } from '@angular/material';
import { Observable, BehaviorSubject, merge } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { GraphNode } from '../../d3-helper.service';
@Component({
  selector: 'app-grid-page-display',
  templateUrl: './grid-page.display.component.html',
  styleUrls: ['./grid-page.display.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridPageDisplayComponent implements OnInit {
  @Input() set entities(value: { entity: GraphNode; relCount: number }[]) {
    if (value) {
      const values = value.map(entry => ({
        ...entry.entity,
        relCount: entry.relCount
      }));
      this.simpleDataSource = values;
      this.exampleDatabase.updateEntities(values);
    }
  }
  simpleDataSource: UserData[];
  @ViewChild(MatSort) sort: MatSort;
  @Input() count: number;
  @Output() countChanged = new EventEmitter<number>();
  displayedColumns = ['displayName', 'relCount', 'color'];
  // tslint:disable-next-line: no-use-before-declare
  exampleDatabase = new ExampleDatabase();
  dataSource: ExampleDataSource | null;
  filter: FormControl = new FormControl();

  constructor() {
    this.filter.valueChanges
      .pipe(
        debounceTime(150),
        distinctUntilChanged()
      )
      .subscribe(value => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = value;
      });
  }

  ngOnInit() {
    // TODO: move tranformation to a service
    // tslint:disable-next-line: no-use-before-declare
    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.sort);
  }

  trackNodesBy(_index: number, node: UserData) {
    return node.displayName;
  }

  updateCount(value: MatSliderChange) {
    this.countChanged.emit(value.value);
  }
}

export interface UserData {
  index?: number;
  displayName: string;
  color: string;
  [key: string]: any;
}

/** An example database that the data source uses to retrieve data for the table. */
export class ExampleDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange = new BehaviorSubject<UserData[]>([]);
  get data(): UserData[] {
    return this.dataChange.value;
  }

  constructor() {}

  /** Adds a new user to the database. */
  updateEntities(entities: GraphNode[]) {
    this.dataChange.next(entities);
  }
}

export class ExampleDataSource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');
  get filter(): string {
    return this._filterChange.value;
  }
  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  constructor(
    private _exampleDatabase: ExampleDatabase,
    private _sort: MatSort
  ) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<UserData[]> {
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._filterChange,
      this._sort.sortChange
    ];

    return merge(...displayDataChanges).pipe(
      map(() => {
        return this._exampleDatabase.data.slice().filter((item: UserData) => {
          const searchStr = item.displayName.toLowerCase();
          return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
        });
      }),
      map(filtered => {
        return this.getSortedData(filtered);
      })
    );
  }

  disconnect() {}

  getSortedData(filtered: UserData[]): UserData[] {
    const data = filtered.slice();
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'displayName':
          [propertyA, propertyB] = [a.displayName, b.displayName];
          break;
        case 'x':
          [propertyA, propertyB] = [a.x, b.x];
          break;
        case 'y':
          [propertyA, propertyB] = [a.y, b.y];
          break;
        case 'color':
          [propertyA, propertyB] = [a.color, b.color];
          break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (
        (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1)
      );
    });
  }
}
