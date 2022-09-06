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
    console.log(this.teams)
  }

  async pullSpecificMatchDay(): Promise<teamInterface[] | undefined> {
    const _team = await this.apiService.getTable(this.selectedMatchDay);
    if (_team !== undefined)
      return _team
    else
      return undefined;
  }

  sortTeams() {
    console.log(this.teams)
    this.teams = this.apiService.sortTeams(this.teams);
  }

  ngOnInit(): void {
  }

}
