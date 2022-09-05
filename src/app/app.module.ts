import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { LoginWrapComponent } from './screens/login-wrap/login-wrap.component';
import { DashboardComponent } from './screens/dashboard/dashboard.component';
import { UserItemComponent } from './screens/user-item/user-item.component';
import { SelectViewComponent } from './screens/select-view/select-view.component';
import { HomeComponent } from './screens/home/home.component';
import { PlayerComponent } from './screens/player/player.component';
import { ChartComponent } from './components/chart/chart.component';
import { MarketComponent } from './screens/market/market.component';
import { LiveMatchComponent } from './screens/live-match/live-match.component';
import { NavigatorComponent } from './components/navigator/navigator.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginWrapComponent,
    DashboardComponent,
    UserItemComponent,
    SelectViewComponent,
    HomeComponent,
    PlayerComponent,
    ChartComponent,
    MarketComponent,
    LiveMatchComponent,
    NavigatorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  
 }
