import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {WelcomeComponent} from "../page/welcome/welcome.component";
import {SphereFormComponent} from "../wiget/sphere-form/sphere-form.component";
import {ChatComponent} from "../page/chat/chat.component";
import {UnauthorizedInterceptor} from "../interceptor/unauthorized.interceptor";
import * as SimplePeer from "simple-peer";

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    ChatComponent,
    SphereFormComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: UnauthorizedInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
