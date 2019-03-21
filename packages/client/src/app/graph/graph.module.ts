import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatCardModule,
  MatListModule,
  MatSidenavModule,
  MatInputModule,
  MatSliderModule,
  MatFormFieldModule
} from '@angular/material';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { GraphPageComponent } from './graph-page/graph-page.component';
import { GraphViewerComponent } from './graph-page/graph-viewer/graph-viewer.component';
import { GraphViewerDisplayComponent } from './graph-page/graph-viewer/graph-viewer.display.component';
import { PeopleListComponent } from './graph-page/people-list/people-list.component';
import { PeopleListDisplayComponent } from './graph-page/people-list/people-list.display.component';

const graphRoutes: Routes = [{ path: '', component: GraphPageComponent }];

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatSidenavModule,
    MatInputModule,
    MatFormFieldModule,
    MatSliderModule,
    RouterModule.forChild(graphRoutes),
    ReactiveFormsModule,
    FlexLayoutModule
  ],
  declarations: [
    GraphPageComponent,
    GraphViewerComponent,
    GraphViewerDisplayComponent,
    PeopleListComponent,
    PeopleListDisplayComponent
  ]
})
export class GraphModule {}
