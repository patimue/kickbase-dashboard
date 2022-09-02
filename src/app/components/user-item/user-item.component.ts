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

  mockPlayer: playerInterface;

  totalRosterValue = 0;


  //PLAYER URL : https://api.kickbase.com/leagues/2644579/players/1685/stats

  //USER URL: 
  constructor(private route: ActivatedRoute, private router: Router) {
    this.mockPlayer = {
      name: "Janis Blaswich",
      number: 21,
      points: 123,
      image: "https://kickbase.b-cdn.net/pool/playersbig/4.png",
      boughtFor: 0,
      marketV: 10000000,
      averagePoints: 150
    }
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') ?? "";
    this.isLoadingFinished = true;
    this.getUserInfo();
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
            fetch(`https://europe-west1-kickbase-dashboard.cloudfunctions.net/getProfileInfo?token=${token}&leagueId=${leagueId}&playerId=${playerElem.id}`, {
              method: "GET",
              redirect: "follow"
            })
              .then(async (res) => {
                if (res.status !== 200)
                  return;
                let text = await res.text();
                let json = JSON.parse(text);
                this.totalRosterValue += json.marketValue;
                this.addPlayer({
                  name: json.firstName  + " " + json.lastName,
                  number: json.number,
                  points: playerElem.t,
                  image: json.profileBig,
                  boughtFor: 0,
                  marketV: json.marketValue,
                  averagePoints: json.averagePoints
                });
              })
              .catch(error => console.log(error));
            console.log(this.players);
          }
          this.isLoadingFinished = true;
        }
      })
      .catch((error) => {
        this.router.navigate(['/dashboard']);
      })
  }


  addPlayer(player: playerInterface) {
    this.players.push(player);
  }

  marketValueString(number : number) : string {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
}
