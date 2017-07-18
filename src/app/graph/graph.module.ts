import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdCardModule, MdListModule, MdSidenavModule, MdInputModule, MdSliderModule } from '@angular/material';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { GraphPageComponent } from './graph-page/graph-page.component';
import { GraphViewerComponent } from './graph-page/graph-viewer/graph-viewer.component';
import { GraphViewerDisplayComponent } from './graph-page/graph-viewer/graph-viewer.display.component';
import { PeopleListComponent } from './graph-page/people-list/people-list.component';
import { PeopleListDisplayComponent } from './graph-page/people-list/people-list.display.component';

const graphRoutes: Routes = [
  { path: '', component: GraphPageComponent}
]

@NgModule({
  imports: [
    CommonModule,
    MdCardModule,
    MdListModule,
    MdSidenavModule,
    MdInputModule,
    MdSliderModule,
    RouterModule.forChild(graphRoutes),
    ReactiveFormsModule
  ],
  declarations: [
    GraphPageComponent,
    GraphViewerComponent,
    GraphViewerDisplayComponent,
    PeopleListComponent,
    PeopleListDisplayComponent
  ]
})
export class GraphModule { }
