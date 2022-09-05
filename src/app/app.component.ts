import { Component } from '@angular/core';
import { Router, Event, RouterEvent } from '@angular/router';
import { filter } from 'rxjs/internal/operators/filter';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'kickbase-dashboard';

  username = environment.username;

  currentUrl = window.location.href;



}
