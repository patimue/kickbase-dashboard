import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { playerInterface, position, userInfo } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss']
})
export class UserItemComponent implements OnInit, OnDestroy{

  public userId!: string;

  public user: userInfo = {
    name: "Loading",
    id: '',
    positive: 0,
    points: 0,
    stats: 0,
    picture: undefined,
    players: []
  };

  players: playerInterface[] = [];

  isLoadingFinished = false;

  mockPlayer: playerInterface;

  totalRosterValue = 0;

  isDestroyed = false;


  //PLAYER URL : https://api.kickbase.com/leagues/2644579/players/1685/stats

  //USER URL: 
  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService) {
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
    this.apiService.getLocal();
    this.setup();
    this.isLoadingFinished = true;
  }

  async setup() {
    let tempUser = await this.apiService.getUser(this.userId);
    if (tempUser !== undefined) {
      this.user = tempUser;
      this.players = this.user.players;
      for(let player of this.players) {
        this.totalRosterValue += player.marketV
      }
      this.sortPlayers();
      this.constantCheck();
    } else {
      this.apiService.reset();
    }
  }

  async constantCheck() {
    while (!this.isDestroyed) {
      await this.sleep(5000);
      let tempUser = await this.apiService.getUser(this.userId);
      if(tempUser !== undefined) {
        this.players = this.user.players;
      }
      this.sortPlayers();
    }
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getInitialUserInfo() {

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
          if (i === 0) {
            let tempArray = [];
            if (_player.points > tempPlayers[i].points) {
              tempArray.push(_player);
              tempArray.concat(tempPlayers);
            } else {
              tempPlayers.push(_player);
            }
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

    }
    this.players = tempPlayers;
  }

  sortPlayersByNumber() {
    let tempPlayers: playerInterface[] = [];
    for (let _player of this.players) {
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
          if (i === 0) {
            let tempArray = [];
            if (_player.number > tempPlayers[i].number) {
              tempArray.push(_player);
              tempArray.concat(tempPlayers);
            } else {
              tempPlayers.push(_player);
            }
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

    }
    this.players = tempPlayers;
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;   
  }
}
