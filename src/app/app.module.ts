import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { LoginWrapComponent } from './components/login-wrap/login-wrap.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserItemComponent } from './components/user-item/user-item.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginWrapComponent,
    DashboardComponent,
    UserItemComponent
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
