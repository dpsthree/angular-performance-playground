import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

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
