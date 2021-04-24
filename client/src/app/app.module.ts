import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AppRoutingModule } from './app-routing.module';
import { CustomInterceptor } from './custom.interceptor';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ReLoginComponent } from './re-login/re-login.component';
import { ColumnFormComponent } from './shared/column-form/column-form.component';
import { HomeComponent } from './home/home.component';
import { DbRenameDialogComponent } from './home/db-rename-dialog.component';
import { DbDeleteConfirmDialogComponent } from './home/db-delete-confirm-dialog.component';
import { DbCreateComponent } from './db-create/db-create.component';
import { DbTableComponent } from './db-table/db-table.component';
import { ColumnEditComponent } from './column-edit/column-edit.component';

@NgModule({
  imports: [
    // Angular
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    // Angular Material
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
    MatToolbarModule,
    // App
    AppRoutingModule
  ],
  bootstrap: [
    AppComponent
  ],
  declarations: [
    // Root
    AppComponent,
    // Login
    LoginComponent,
    ReLoginComponent,
    // Shared
    ColumnFormComponent,
    // Home
    HomeComponent,
    DbRenameDialogComponent,
    DbDeleteConfirmDialogComponent,
    // DB Create
    DbCreateComponent,
    // DB Table
    DbTableComponent,
    // Column Edit
    ColumnEditComponent
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
