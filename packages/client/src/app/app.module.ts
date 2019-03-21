import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { D3HelperService } from './d3-helper.service';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MaterialDepsModule } from './material-deps/material-deps.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

console.log('App Started');

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialDepsModule,
  ],
  providers: [D3HelperService],
  bootstrap: [AppComponent],
})
export class AppModule {}
