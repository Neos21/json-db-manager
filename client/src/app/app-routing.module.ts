import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth.guard';

import { LoginComponent } from './login/login.component';

import { HomeComponent } from './home/home.component';
import { DbCreateComponent } from './db-create/db-create.component';

const routes: Routes = [
  { path: 'login'    , component: LoginComponent },
  { path: 'home'     , component: HomeComponent    , canActivate: [AuthGuard] },
  { path: 'db-create', component: DbCreateComponent, canActivate: [AuthGuard] },
  // 未指定時はリダイレクトにしておき AuthGuard によって必要に応じて `/login` に振り分けさせる
  { path: '', pathMatch: 'full', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
