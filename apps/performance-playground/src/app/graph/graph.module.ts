import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { GraphPageComponent } from './graph-page/graph-page.component';
import { GraphViewerComponent } from './graph-page/graph-viewer/graph-viewer.component';
import { GraphViewerDisplayComponent } from './graph-page/graph-viewer/graph-viewer.display.component';
import { PeopleListComponent } from './graph-page/people-list/people-list.component';
import { PeopleListDisplayComponent } from './graph-page/people-list/people-list.display.component';
import { MaterialDepsModule } from '../material-deps/material-deps.module';

const graphRoutes: Routes = [{ path: '', component: GraphPageComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(graphRoutes),
    ReactiveFormsModule,
    MaterialDepsModule,
  ],
  declarations: [
    GraphPageComponent,
    GraphViewerComponent,
    GraphViewerDisplayComponent,
    PeopleListComponent,
    PeopleListDisplayComponent,
  ],
})
export class GraphModule {}
