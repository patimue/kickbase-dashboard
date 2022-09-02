import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginWrapComponent } from './components/login-wrap/login-wrap.component';
import { SelectViewComponent } from './components/select-view/select-view.component';
import { UserItemComponent } from './components/user-item/user-item.component';

const routes: Routes = [
  {
    path: "login",
    component: LoginWrapComponent
  },
  {
    path: "select",
    component: SelectViewComponent
  },
  {
    path: "dashboard",
    component: DashboardComponent
  },
  {
    path: "user/:id",
    component: UserItemComponent
  },
  {
    path: "player/:id",
    component: UserItemComponent
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
