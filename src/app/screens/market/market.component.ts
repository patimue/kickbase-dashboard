import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { playerInterface } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})
export class MarketComponent implements OnInit {

  @Input() players?: playerInterface[];

  constructor(private apiService: ApiService, private router: Router) {
    this.setup();
  }


  async setup() {
    this.apiService.getLocal();
    this.players = await this.apiService.getMarket();
    this.sortOffers();
    this.players.reverse();
  }

  navigatePlayer(id: number) {
    this.router.navigate([`/player/${id}`])
  }

  ngOnInit(): void {
  }

  sortOffers() {
    let tempPlayers: playerInterface[] = [];
    if (this.players !== undefined)
      for (let _player of this.players) {
        console.log(_player)
        let ran = false;
        if (_player.endsIn !== undefined)
          for (let i = 0; i < tempPlayers.length; i++) {
            ran = true;
            if (_player.endsIn <= tempPlayers[i].endsIn!) {
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
                if (_player.endsIn > tempPlayers[i].endsIn!) {
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

  marketValueString(number: number): string {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  calcEndTime(seconds: number): string {
    if (Math.floor(seconds / 60) > 60)
      return "" + Math.floor(seconds / 60 / 60) + "h" +
      Math.floor((seconds - 60 * 60 * Math.floor(seconds / 60 / 60) ) / 60) + "min" + 
      seconds % 60 + "s";
    else
      return "" + Math.floor(seconds / 60) + "min" + seconds % 60 + "s";
  }
}

