import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-select-view',
  templateUrl: './select-view.component.html',
  styleUrls: ['./select-view.component.scss']
})
export class SelectViewComponent implements OnInit {

  constructor(private router : Router, private apiService: ApiService) { 
    this.checkStorage();
  }

  ngOnInit(): void {
    this.apiService.getLocal();
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
