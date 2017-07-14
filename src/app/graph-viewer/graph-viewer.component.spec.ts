import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphViewerComponent } from './graph-viewer.component';

describe('GraphViewerComponent', () => {
  let component: GraphViewerComponent;
  let fixture: ComponentFixture<GraphViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
