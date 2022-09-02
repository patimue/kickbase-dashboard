import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-view',
  templateUrl: './select-view.component.html',
  styleUrls: ['./select-view.component.scss']
})
export class SelectViewComponent implements OnInit {

  constructor(private router : Router) { 
    this.checkStorage();
  }

  ngOnInit(): void {
  }

  checkStorage() {
    const token = localStorage.getItem('ctoken');
    const leagueid = localStorage.getItem('leagueid');

    if (token === undefined || leagueid === undefined) {
      this.router.navigate(['/login']);
    }
  }

  navigateMarket() {
    this.router.navigate(['/market'])
  }

  navigateMatchday() {
    this.router.navigate(['/dashboard'])
  }

}
