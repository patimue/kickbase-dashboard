import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router, Event, RouterEvent, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss']
})
export class NavigatorComponent implements AfterViewInit {

  @ViewChild('indicator') indicator: any | null;

  @Input() url!: string;

  hidden = false;

  constructor(public router: Router, private apiService : ApiService) {

  }

  ngAfterViewInit(): void {
    this.router.events.pipe(
      filter((e: Event): e is RouterEvent => e instanceof RouterEvent)
    ).subscribe((e: RouterEvent) => {
      if (e instanceof NavigationEnd) {
        this.hidden = false;
        this.url = e.url.substring(1);
        console.log(this.url);
        this.calculateIndicator();
      }
    });
  }

  calculateIndicator() {
    try {
      let element = document.querySelector(`#${this.url}`);
      console.log(element);
      console.log('Found again');
      if (this.indicator !== null) {
        if (this.indicator.nativeElement instanceof HTMLElement) {
          if (element instanceof HTMLElement) {
            this.indicator.nativeElement.style.left = element.offsetLeft + "px";
          } else {
            console.log("Unknown")
            this.hidden = true;
          }
        }
      }
    } catch (e) {
      this.hidden = true;
    }
  }

  navigate(option: string) {
    this.router.navigate([`/${option}`]);
  }

}
