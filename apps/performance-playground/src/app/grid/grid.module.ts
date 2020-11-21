import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { ReactiveFormsModule } from '@angular/forms';

import { GridPageComponent } from './grid-page/grid-page.component';
import { GridPageDisplayComponent } from './grid-page/grid-page.display.component';

const gridRoutes: Routes = [{ path: '', component: GridPageComponent }];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(gridRoutes),
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    CdkTableModule,
    ReactiveFormsModule,
    MatListModule,
    MatSliderModule,
    MatSortModule
  ],
  declarations: [GridPageComponent, GridPageDisplayComponent]
})
export class GridModule {}
