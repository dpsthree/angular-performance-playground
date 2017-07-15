import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { D3HelperService } from './d3-helper.service';
import { AppComponent } from './app.component';
import { GraphViewerComponent } from './graph-viewer/graph-viewer.component';
import { PeopleListComponent } from './people-list/people-list.component';

@NgModule({
  declarations: [
    AppComponent,
    GraphViewerComponent,
    PeopleListComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [D3HelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
