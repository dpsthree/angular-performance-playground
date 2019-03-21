import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { GridPageComponent } from './grid-page/grid-page.component';
import { GridPageDisplayComponent } from './grid-page/grid-page.display.component';
import { MaterialDepsModule } from 'app/material-deps/material-deps.module';

const gridRoutes: Routes = [{ path: '', component: GridPageComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(gridRoutes),
    ReactiveFormsModule,
    MaterialDepsModule,
  ],
  declarations: [GridPageComponent, GridPageDisplayComponent],
})
export class GridModule {}
