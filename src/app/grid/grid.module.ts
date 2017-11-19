import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MatInputModule, MatTableModule, MatListModule, MatSortModule, MatSliderModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';

import { GridPageComponent } from './grid-page/grid-page.component';
import { GridPageDisplayComponent } from './grid-page/grid-page.display.component';

const gridRoutes: Routes = [
  { path: '', component: GridPageComponent }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(gridRoutes),
    MatInputModule,
    MatTableModule,
    CdkTableModule,
    ReactiveFormsModule,
    MatListModule,
    MatSliderModule,
    MatSortModule
  ],
  declarations: [
    GridPageComponent,
    GridPageDisplayComponent
  ]
})
export class GridModule { }
