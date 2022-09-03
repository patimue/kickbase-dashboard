import { Injectable } from '@angular/core';
import { teamInterface } from '../models/teams.model';
import { playerInterface, position } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private teams: teamInterface[];

  private currentMatchDay = 1;
  private token: string | undefined;
  private leagueId: string | undefined;

  constructor() {
    this.teams = [];
  }

  getLocal() {
    let token = localStorage.getItem('ctoken');
    let leagueId = localStorage.getItem('leagueid');

    if (token !== null)
      this.token = token;
    if (leagueId !== null)
      this.leagueId = leagueId;
  }

  getTable(): teamInterface[] {
    if (this.token !== undefined) {
      fetch(`https://europe-west1-kickbase-dashboard.cloudfunctions.net/getTable?matchDay=${this.currentMatchDay}&token=${this.token}`, {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        }
      })
        .then((res) => {
          res.json()
            .then((json) => {
              for (let team of json.t) {
                this.teams.push({
                  name: team.tn,
                  standing: team.pl,
                  id: team.tid
                })
              }
              this.teams = this.sortTeams();
            })
        })
        .catch((error) => {
          console.log(error);
        })
    }
    return this.teams;
  }

  sortTeams(): teamInterface[] {
    let tempTeams: teamInterface[] = [];
    for (let team of this.teams) {
      let ran = false;
      for (let i = 0; i < tempTeams.length; i++) {
        ran = true;
        if (team.standing >= tempTeams[i].standing) {
          continue;
        } else {
          let secondHalf = tempTeams.slice(i, tempTeams.length);
          let firstHalf = tempTeams.slice(0, i);
          firstHalf.push(team);
          tempTeams = firstHalf.concat(secondHalf);
        }
      }
      if (!ran) {
        tempTeams.push(team);
      }
    }

    return tempTeams;
  }


  async getPlayer(id: string): Promise<playerInterface | undefined> {
    let tempPlayer: playerInterface = {
      name: '',
      number: 0,
      points: 0,
      image: '',
      boughtFor: 0,
      marketV: 0,
      averagePoints: 0,
      position: '',
      id: 0,
      teamId: ''
    }
    let response = await fetch(`https://europe-west1-kickbase-dashboard.cloudfunctions.net/getPlayer?token=${this.token}&playerId=${id}&leagueId=${this.leagueId}`, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      }
    })
      .then((response) => {
        let text = response.text()
          .then(text => {
            let json = JSON.parse(text);
            if (json.marketValues !== undefined) {
              console.log('Found Market Values')
              if (json.marketValues.length > 20) {
                tempPlayer.marketValues = [];
                console.log('Adding market values')
                for (let i = json.marketValues.length - 1; i > json.marketValues.length - 20; i--) {
                  tempPlayer.marketValues?.push(json.marketValues[i]['m'])
                }
              }
            }
            console.log('Returning Text')
            return text;
          })
        return text;
      })
    let json = JSON.parse(response);
    console.log('Filling player')
    tempPlayer = {
      name: json.firstName + " " + json.lastName,
      number: json.number,
      points: json.points,
      user: json.userName,
      teamId: json.teamId,
      image: `https://kickbase.b-cdn.net/pool/playersbig/${json.id}.png`,
      boughtFor: json.leaguePlayer !== undefined ? json.leaguePlayer.buyPrice ?? 0 : 0,
      marketV: json.marketValue,
      averagePoints: json.averagePoints,
      position: this.matchPlayerNumber(json.position),
      id: json.id,
      marketValues: tempPlayer.marketValues
    };
    console.log(tempPlayer);
    return tempPlayer;
  }

  matchPlayerNumber(num: number): string {
    if (num === 1 || num === 2 || num === 3 || num === 4)
      return position[num];
    else
      return "Unknown"
  }

  async getPlayerStatus(id: string): Promise<string> {
    let status = "Unknown";
    status = await fetch(`https://europe-west1-kickbase-dashboard.cloudfunctions.net/getPlayerStatus?token=${this.token}&leagueId=${this.leagueId}&playerId=${id}`)
      .then(async (response) => {
        let text = await response.text();
        return text;
      })
    return status;
  }

  async getTeamById(id: string): Promise<string> {
    let team = 'Unknown';
    team = await fetch(`https://europe-west1-kickbase-dashboard.cloudfunctions.net/getTeamById?token=${this.token}&teamId=${id}`)
      .then(async (response) => {
        let text = await response.text();
        return text;
      })
    return team;
  }
}
