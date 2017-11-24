import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MatCardModule, MatIconModule, MatButtonModule } from '@angular/material';

import { AboutComponent } from './about.component';

const aboutRoutes: Routes = [
  { path: '', component: AboutComponent }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(aboutRoutes),
    MatCardModule, MatIconModule, MatButtonModule
  ],
  declarations: [AboutComponent]
})
export class AboutModule { }
