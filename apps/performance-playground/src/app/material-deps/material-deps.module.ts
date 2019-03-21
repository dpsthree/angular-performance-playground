import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatToolbarModule,
  MatButtonModule,
  MatInputModule,
  MatTableModule,
  MatListModule,
  MatSortModule,
  MatSliderModule,
  MatFormFieldModule,
  MatCardModule,
  MatSidenavModule,
  MatIconModule,
} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatListModule,
    MatSortModule,
    MatSliderModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatSliderModule,
    MatFormFieldModule,
    CdkTableModule,
  ],
  exports: [
    FlexLayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatListModule,
    MatSortModule,
    MatSliderModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatSliderModule,
    MatFormFieldModule,
    CdkTableModule,
  ],
})
export class MaterialDepsModule {}
