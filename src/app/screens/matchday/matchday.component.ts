import { Component, OnInit } from '@angular/core';
import { teamInterface } from 'src/app/models/teams.model';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-matchday',
  templateUrl: './matchday.component.html',
  styleUrls: ['./matchday.component.scss']
})
export class MatchdayComponent implements OnInit {

  teams: teamInterface[] = [];

  selectedMatchDay = 1;

  expandTable = false;

  constructor(private apiService: ApiService) {
    this.setup();
  }

  async setup() {
    await this.apiService.getLocal();
    let tempTable = await this.apiService.getTable(this.selectedMatchDay);
    if (tempTable !== undefined) {
      if (this.selectedMatchDay !== tempTable[0].cmd) {
        this.selectedMatchDay = tempTable[0].cmd!;
        const _team = await this.pullSpecificMatchDay();
        if (_team !== undefined)
          tempTable = _team;
      }
      this.teams = tempTable;
    }
    this.sortTeams();
  }

  async pullSpecificMatchDay(): Promise<teamInterface[] | undefined> {
    const _team = await this.apiService.getTable(this.selectedMatchDay);
    if (_team !== undefined)
      return _team
    else
      return undefined;
  }

  async selectDifferentMatchDay(smd : number) {
    const _team = await this.apiService.getTable(smd);
    if(_team != undefined) {
      this.teams = _team;
      this.sortTeams();
      this.selectedMatchDay = smd;
    }
  }

  sortTeams() {
    let tempTeams: teamInterface[] = [];
    for (let _player of this.teams) {
      let ran = false;
      for (let i = 0; i < tempTeams.length; i++) {
        ran = true;
        if (_player.standing <= tempTeams[i].standing) {
          if (i == tempTeams.length - 1) {
            tempTeams.push(_player);
            break;
          }
          continue;
        } else {
          let firstHalf = tempTeams.slice(0, i);
          if (i === 0) {
            let tempArray = [];
            if (_player.standing > tempTeams[i].standing) {
              tempArray.push(_player);
              tempArray.concat(tempTeams);
            } else {
              tempTeams.push(_player);
            }
            tempTeams = tempArray.concat(tempTeams);
          } else {
            let secondHalf = tempTeams.slice(i, tempTeams.length);
            firstHalf.push(_player);
            tempTeams = firstHalf.concat(secondHalf);
          }

        }
        break;
      }
      if (!ran) {
        tempTeams.push(_player);
      }

    }
    this.teams = tempTeams.reverse();

  }


  ngOnInit(): void {
  }

}
