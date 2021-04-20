import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AppRoutingModule } from './app-routing.module';
import { CustomInterceptor } from './custom.interceptor';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { HomeComponent } from './home/home.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    
    AppRoutingModule
  ],
  bootstrap: [
    AppComponent
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    
    HomeComponent
  ],
  providers: [
    // クッキーによるセッション管理を有効にする
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomInterceptor,
      multi: true
    }
  ]
})
export class AppModule { }
