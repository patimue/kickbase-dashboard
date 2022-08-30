import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { userInfo, playerInterface } from 'src/app/models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  players : userInfo[] = [];

  showTile = false; 

  constructor(private router: Router) {
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
    fetch(`https://europe-west1-kickbase-dashboard.cloudfunctions.net/getMatchDay?token=${token}&leagueId=${leagueid}`, {
      method: "GET",
      redirect: "follow"
    })
    .then(async (res) => {
      if(res.status === 200) {
        let text = await res.text();
        console.log(text);
        const json = JSON.parse(text);
        for(let user of json.u) {
          this.players.push({
            name: user.n,
            positive: user.b,
            points: user.t,
            stats: user.st,
            picture: user.i,
            players: []
          })
        }
      } else {
        console.log('error');
      }
    })
    .catch((error) => {
      console.log(error);
    })
  }

  openTile(user : userInfo) {
    this.showTile = true;
  }

}
