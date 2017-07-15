import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MdCardModule, MdListModule, MdSidenavModule } from '@angular/material';
import { NgModule } from '@angular/core';

import { D3HelperService } from './d3-helper.service';
import { AppComponent } from './app.component';
import { GraphViewerComponent } from './graph-viewer/graph-viewer.component';
import { GraphViewerDisplayComponent } from './graph-viewer/graph-viewer.display.component';
import { PeopleListComponent } from './people-list/people-list.component';
import { PeopleListDisplayComponent } from './people-list/people-list.display.component';

@NgModule({
  declarations: [
    AppComponent,
    GraphViewerComponent,
    GraphViewerDisplayComponent,
    PeopleListComponent,
    PeopleListDisplayComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MdCardModule,
    MdListModule,
    MdSidenavModule
  ],
  providers: [D3HelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
