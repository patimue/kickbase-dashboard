import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { playerInterface, userInfo } from 'src/app/models/user.model';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss']
})
export class UserItemComponent implements OnInit {

  public userId!: string;

  public user!: userInfo;

  players: playerInterface[] = [];

  isLoadingFinished = false;

  //PLAYER URL : https://api.kickbase.com/leagues/2644579/players/1685/stats

  //USER URL: 
  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') ?? "";
    this.isLoadingFinished = true; 
    // this.getUserInfo();
  }

  getUserInfo() {
    if (this.userId === "") {
      this.router.navigate(['/dashboard']);
    }

    let leagueId = localStorage.getItem('leagueid');
    let token = localStorage.getItem('ctoken');
    if (leagueId === undefined || token === undefined) {
      this.router.navigate(['/login']);
    }

    fetch(`https://europe-west1-kickbase-dashboard.cloudfunctions.net/getMatchDay?token=${token}&leagueId=${leagueId}`, {
      method: "GET",
      redirect: "follow"
    })
      .then(async (response) => {
        if (response.status !== 200) {
          this.router.navigate(['/dashboard']);
        }
        let text = await response.text()
        const json = JSON.parse(text);
        for (let user of json.u) {
          if (user.id !== this.userId) {
            continue;
          }
          this.user = {
            id: user.n,
            name: user.n,
            points: user.t,
            positive: user.b,
            stats: user.st,
            picture: user.i,
            players: this.players
          }
          for (let playerElem of user.pl) {
            this.players.push({
              name: playerElem.fn + " " + playerElem.n,
              number: playerElem.nr,
              points: playerElem.t,
              image: playerElem.i
            })
            console.log(this.players);
          }
          this.isLoadingFinished = true;
        }
      })
      .catch((error) => {
        this.router.navigate(['/dashboard']);
      })
  }

}
