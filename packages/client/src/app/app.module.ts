import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { MatToolbarModule, MatButtonModule } from '@angular/material';

import { D3HelperService } from './d3-helper.service';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

console.log('App Started');

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpClientModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule
  ],
  providers: [D3HelperService],
  bootstrap: [AppComponent]
})
export class AppModule {}
