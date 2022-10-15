import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SortSelectorComponent } from 'src/app/components/sort-selector/sort-selector.component';
import { userInfo, playerInterface } from 'src/app/models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  players: userInfo[] = [];

  showTile = false;

  finishedLoading = false;

  @ViewChild('selector') selector : SortSelectorComponent | undefined;

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

    if (token === null || leagueid === null) {
      this.router.navigate(['/login']);
    }
    fetch(`https://europe-west1-kickbase-dashboard.cloudfunctions.net/getMatchDay?token=${token}&leagueId=${leagueid}`, {
      method: "GET",
      redirect: "follow"
    })
      .then(async (res) => {
        if (res.status === 200) {
          this.players = await res.text()
            .then(async (text): Promise<userInfo[]> => {
              const json = JSON.parse(text);
              const players: userInfo[] = [];
              for await (let user of json.u) {
                players.push({
                  id: user.id,
                  name: user.n,
                  positive: user.b,
                  points: user.t,
                  stats: user.st,
                  picture: user.i ?? "https://upload.wikimedia.org/wikipedia/commons/2/2c/Kickbase_Logo.jpg",
                  players: []
                })
              }
              console.log('Returning');
              return players;
            })
            if(this.selector !== undefined) {
              this.sortPlayers(this.selector.choice ?? "Overall");
            }
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

  sortPlayers(type: string) {
    console.log('Sorting players');
    console.log(type);
    let tempPlayers: userInfo[] = [];
    for (let player of this.players) {
      let ran = false;
      for (let i = 0; i < tempPlayers.length; i++) {
        ran = true;
        if (type === "Overall" ? player.stats <= tempPlayers[i].stats : player.points <= tempPlayers[i].points) {
          if (i == tempPlayers.length - 1) {
            tempPlayers.push(player);
            break;
          }
          continue;
        } else {
          let firstHalf = tempPlayers.slice(0, i);
          if (i === 0) {
            let tempArray = [];
            if (type === "Overall" ? player.stats > tempPlayers[i].stats : player.points > tempPlayers[i].points) {
              tempArray.push(player);
              tempArray.concat(tempPlayers);
            } else {
              tempPlayers.push(player);
            }
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

    }
    this.players = tempPlayers;
  }

}
