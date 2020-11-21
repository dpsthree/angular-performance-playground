import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { AboutComponent } from './about.component';
import { MaterialDepsModule } from '../material-deps/material-deps.module';

const aboutRoutes: Routes = [{ path: '', component: AboutComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(aboutRoutes),
    MaterialDepsModule,
  ],
  declarations: [AboutComponent],
})
export class AboutModule {}
