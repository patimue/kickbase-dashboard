import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { userInfo, playerInterface } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  players : userInfo[] = [];

  showTile = false; 

  constructor(private router: Router, private apiService : ApiService) {
    this.checkStorage();
  }

  ngOnInit(): void {
  }

  checkStorage() {
    const token = localStorage.getItem('ctoken');
    const leagueid = localStorage.getItem('leagueid');

    if (token === undefined || leagueid === undefined) {
      this.router.navigate(['/login']);
      return;
    }
    this.apiService.getMatchDay(leagueid!, token!);


    for(let i = 0; i <= 5; i++) {
      setTimeout(() => {
        console.log(this.apiService.users)
        this.players = this.apiService.users;
      }, 1000)
    }
  }

  openTile(user : userInfo) {
    this.showTile = true;
  }

}
