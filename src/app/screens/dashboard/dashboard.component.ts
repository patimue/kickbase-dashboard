import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { userInfo, playerInterface } from 'src/app/models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  players: userInfo[] = [];

  showTile = false;

  public mockUser: userInfo = {
    name: "Paul",
    positive: 1.0,
    points: 100,
    stats: 4000,
    picture: undefined ?? "https://upload.wikimedia.org/wikipedia/commons/2/2c/Kickbase_Logo.jpg",
    players: [],
    id: '123123'
  }

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
        if (res.status === 200) {
          let text = await res.text();
          console.log(text);
          const json = JSON.parse(text);
          for (let user of json.u) {
            this.players.push({
              id: user.id,
              name: user.n,
              positive: user.b,
              points: user.t,
              stats: user.st,
              picture: user.i ?? "https://upload.wikimedia.org/wikipedia/commons/2/2c/Kickbase_Logo.jpg",
              players: []
            })
          }
          this.sortPlayers();
        } else {
          console.log('error');
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }

  openTile(user: userInfo) {
    this.router.navigate([`/user/${user.id}`])
  }

  sortPlayers() {
    let tempPlayers: userInfo[] = [];
    for (let player of this.players) {
      console.log(player)
      let ran = false;
      for (let i = 0; i < tempPlayers.length; i++) {
        ran = true;
        if (player.stats <= tempPlayers[i].stats) {
          if(i == tempPlayers.length - 1 ) {
            tempPlayers.push(player);
            break;
          }
          continue;
        } else {
          let firstHalf = tempPlayers.slice(0, i);
          console.log(firstHalf);
          if (i === 0) {
            let tempArray = [];
            if (player.stats > tempPlayers[i].stats) {
              tempArray.push(player);
              tempArray.concat(tempPlayers);
            } else {
              tempPlayers.push(player);
            }
            console.log('Concatting')
            tempPlayers = tempArray.concat(tempPlayers);
          } else {
            let secondHalf = tempPlayers.slice(i, tempPlayers.length);
            firstHalf.push(player);
            tempPlayers = firstHalf.concat(secondHalf);
          }

        }
        break;
      }
      if (!ran) {
        tempPlayers.push(player);
      }

      console.log(tempPlayers);
    }
    this.players = tempPlayers;
  }

}
