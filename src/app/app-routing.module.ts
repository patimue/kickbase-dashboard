import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './screens/dashboard/dashboard.component';
import { LiveMatchComponent } from './screens/live-match/live-match.component';
import { LoginWrapComponent } from './screens/login-wrap/login-wrap.component';
import { MarketComponent } from './screens/market/market.component';
import { MatchdayComponent } from './screens/matchday/matchday.component';
import { PlayerComponent } from './screens/player/player.component';
import { SelectViewComponent } from './screens/select-view/select-view.component';
import { UserItemComponent } from './screens/user-item/user-item.component';

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
    path: "market",
    component: MarketComponent
  },
  {
    path: "table",
    component: MatchdayComponent
  },
  {
    path: "user/:id",
    component: UserItemComponent
  },
  {
    path: "player/:id",
    component: PlayerComponent
  },
  {
    path: "player/:id",
    component: UserItemComponent
  },
  {
    path: "match/:id",
    component: LiveMatchComponent
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
