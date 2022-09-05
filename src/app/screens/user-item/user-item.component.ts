import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { playerInterface, position, userInfo } from 'src/app/models/user.model';

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
      teamId: '15',
      number: 21,
      points: 123,
      image: "https://kickbase.b-cdn.net/pool/playersbig/4.png",
      boughtFor: 0,
      marketV: 10000000,
      id: 1,
      averagePoints: 150,
      position: position[1]
    }
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') ?? "";
    this.isLoadingFinished = true;
    this.constantCheck();
  }

  async constantCheck() {
    while (true) {
      this.getUserInfo();
      await this.sleep(5000);
    }
  }

  sleep(ms : number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getUserInfo() {
    this.totalRosterValue = 0;
    this.players = [];
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
                let isLive = await fetch(``)
                this.addPlayer({
                  name: json.firstName + " " + json.lastName,
                  number: json.number,
                  points: playerElem.t,
                  position: this.matchPlayerNumber(json.position),
                  image: json.profileBig,
                  boughtFor: 0,
                  teamId: json.teamId,
                  marketV: json.marketValue,
                  id: json.id,
                  averagePoints: json.averagePoints,
                  status: json.status === 0 ? "Fit" : "Check"
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
    this.sortPlayersByNumber();
    this.sortPlayers();
  }

  marketValueString(number: number): string {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  matchPlayerNumber(num: number): string {
    if (num === 1 || num === 2 || num === 3 || num === 4)
      return position[num];
    else
      return "Unknown"
  }

  navigateDetailsPage(id: number) {
    this.router.navigate([`/player/${id}`])
  }

  sortPlayers() {
    let tempPlayers: playerInterface[] = [];
    for (let _player of this.players) {
      console.log(_player)
      let ran = false;
      for (let i = 0; i < tempPlayers.length; i++) {
        ran = true;
        if (_player.points <= tempPlayers[i].points) {
          if (i == tempPlayers.length - 1) {
            tempPlayers.push(_player);
            break;
          }
          continue;
        } else {
          let firstHalf = tempPlayers.slice(0, i);
          console.log(firstHalf);
          if (i === 0) {
            let tempArray = [];
            if (_player.points > tempPlayers[i].points) {
              tempArray.push(_player);
              tempArray.concat(tempPlayers);
            } else {
              tempPlayers.push(_player);
            }
            console.log('Concatting')
            tempPlayers = tempArray.concat(tempPlayers);
          } else {
            let secondHalf = tempPlayers.slice(i, tempPlayers.length);
            firstHalf.push(_player);
            tempPlayers = firstHalf.concat(secondHalf);
          }

        }
        break;
      }
      if (!ran) {
        tempPlayers.push(_player);
      }

      console.log(tempPlayers);
    }
    this.players = tempPlayers;
  }

  sortPlayersByNumber() {
    let tempPlayers: playerInterface[] = [];
    for (let _player of this.players) {
      console.log(_player)
      let ran = false;
      for (let i = 0; i < tempPlayers.length; i++) {
        ran = true;
        if (_player.number <= tempPlayers[i].number) {
          if (i == tempPlayers.length - 1) {
            tempPlayers.push(_player);
            break;
          }
          continue;
        } else {
          let firstHalf = tempPlayers.slice(0, i);
          console.log(firstHalf);
          if (i === 0) {
            let tempArray = [];
            if (_player.number > tempPlayers[i].number) {
              tempArray.push(_player);
              tempArray.concat(tempPlayers);
            } else {
              tempPlayers.push(_player);
            }
            console.log('Concatting')
            tempPlayers = tempArray.concat(tempPlayers);
          } else {
            let secondHalf = tempPlayers.slice(i, tempPlayers.length);
            firstHalf.push(_player);
            tempPlayers = firstHalf.concat(secondHalf);
          }

        }
        break;
      }
      if (!ran) {
        tempPlayers.push(_player);
      }

      console.log(tempPlayers);
    }
    this.players = tempPlayers;
  }
}
