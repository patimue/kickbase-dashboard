import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginWrapComponent } from './components/login-wrap/login-wrap.component';

const routes: Routes = [
  {
    path: "login",
    component: LoginWrapComponent
  },
  {
    path: "dashboard",
    component: DashboardComponent
  },
  {
    path: "**",
    redirectTo: "login",
    pathMatch: "full"
  },
  {
    path : "",
    redirectTo : "login",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
