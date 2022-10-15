import { Component, OnInit } from '@angular/core';
import { Match, teamInterface } from 'src/app/models/teams.model';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-matchday',
  templateUrl: './matchday.component.html',
  styleUrls: ['./matchday.component.scss']
})
export class MatchdayComponent implements OnInit {

  teams: teamInterface[] = [];

  matches: Match[] = [];

  loading = false;



  selectedMatchDay = 1;

  expandTable = false;

  constructor(private apiService: ApiService) {
    this.setup();
  }

  async setup() {
    this.loading = true;
    await this.apiService.getLocal();
    let tempTable = await this.apiService.getTable(this.selectedMatchDay);
    if (tempTable !== undefined) {
      if (this.selectedMatchDay !== tempTable[0].cmd) {
        this.selectedMatchDay = tempTable[0].cmd!;
        const _team = await this.pullSpecificMatchDay();
        console.log('Had to choose different matchday')
        console.log(_team)
        if (_team !== undefined)
          tempTable = _team;
      }
      this.teams = tempTable;
    }
    this.sortTeams();
    this.loading = false;
  }

  async pullSpecificMatchDay(): Promise<teamInterface[] | undefined> {
    const _team = await this.apiService.getTable(this.selectedMatchDay);
    await this.getMatches();
    if (_team !== undefined)
      return _team
    else
      return undefined;
  }

  async getMatches() {
    const matches = await this.apiService.getMatches(this.selectedMatchDay);
    const matches2 = await this.apiService.getMatchesDetailed();
    console.log('Detailed Matches: ')
    console.log(matches2);
    this.matches = [];
    for await (const matchUp of matches.m) {
      this.matches.push({
        teamOne: matchUp['t1n'],
        teamTwo: matchUp['t2n'],
        teamOnePoints: matchUp['t1s'],
        teamTwoPoints: matchUp['t2s'],
        status: matchUp['s'],
        minutes: 0
      })
    }
    console.log(matches);
    console.log(this.matches);
  }

  async selectDifferentMatchDay(smd: number) {
    this.loading = true;
    const _team = await this.apiService.getTable(smd);
    console.log('Selected different matchday');
    if (_team != undefined) {
      this.teams = _team;
      this.sortTeams();
      this.selectedMatchDay = smd;
      await this.getMatches();
    }
    this.loading = false;
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
