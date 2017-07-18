import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphPageComponent } from './graph-page.component';

describe('GraphPageComponent', () => {
  let component: GraphPageComponent;
  let fixture: ComponentFixture<GraphPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
