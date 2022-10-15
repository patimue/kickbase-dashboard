import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { teamInterface } from '../models/teams.model';
import { playerInterface, position, userInfo } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private teams: teamInterface[];

  private currentMatchDay = 1;
  private token: string | undefined;
  private leagueId: string | undefined;

  constructor(private router: Router) {
    this.teams = [];
  }

  getLocal() {
    let token = localStorage.getItem('ctoken');
    let leagueId = localStorage.getItem('leagueid');

    if (token !== null)
      this.token = token;
    else
      this.reset();
    if (leagueId !== null)
      this.leagueId = leagueId;
    else
      this.reset();
  }

  reset() {
    localStorage.clear();
    if (!window.location.href.includes('login'))
      this.router.navigate(['/login'])
  }

  async getTable(matchDay: number): Promise<teamInterface[] | undefined> {
    const teams = await fetch(`https://europe-west1-kickbase-dashboard.cloudfunctions.net/getTable?matchDay=${matchDay}&token=${this.token}`, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      }
    })
      .then(async (res): Promise<any> => {
        let teams: teamInterface[] = [];
        teams = await res.text()
          .then((text) => {
            let _teams: teamInterface[] = [];
            let json = JSON.parse(text);
            console.log(json);
            for (let team of json.t) {
              _teams.push({
                name: team.tn,
                standing: team.pl,
                id: team.tid,
                cmd: json.cmd
              })
            }
            return _teams;
          })
        return teams;
      })
      .catch((error) => {
        console.log(error);
        this.reset();
      })
    console.log(teams);
    return teams;
  }

  async getMatches(matchDay: number): Promise<any> {
    const response = await fetch(`https://europe-west1-kickbase-dashboard.cloudfunctions.net/getMatches?matchDay=${matchDay}&token=${this.token}`, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      }
    })
      .then(async (res): Promise<any> => {
        const response = await res.text();
        return JSON.parse(response);
      })
      .catch((error) => {
        this.reset();
      })
    return response;
  }

  sortTeams(teams: teamInterface[]): teamInterface[] {
    let tempTeams: teamInterface[] = [];
    for (let team of teams) {
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

  async getUser(userId: string): Promise<userInfo | undefined> {
    let user: userInfo | undefined;
    const request = await fetch(`https://europe-west1-kickbase-dashboard.cloudfunctions.net/getMatchDay?token=${this.token}&leagueId=${this.leagueId}`, {
      method: "GET",
      redirect: "follow"
    })
      .then(async (response) => {
        return await response.text()
          .then(async (text): Promise<any> => {
            const json = JSON.parse(text);
            for (let user of json.u) {
              if (user.id !== userId) {
                continue;
              }
              let _user: userInfo = {
                id: user.n,
                name: user.n,
                points: user.t,
                positive: user.b,
                stats: user.st,
                picture: user.i,
                players: []
              }
              for await (const player of user.pl) {
                let tempPlayer = await this.getPlayerAsync(player.id);
                if (tempPlayer !== undefined) {
                  tempPlayer.points = player.t;
                  _user.players.push(tempPlayer);
                }
              }
              return _user;
            }
          })
      })
      .catch((error) => {
        this.reset();
        return undefined;
      })
    return request;
  }

  async getPlayerAsync(playerId: number): Promise<playerInterface | undefined> {
    return await fetch(`https://europe-west1-kickbase-dashboard.cloudfunctions.net/getProfileInfo?token=${this.token}&leagueId=${this.leagueId}&playerId=${playerId}`)
      .then(async (response): Promise<playerInterface> => {
        return await response.text()
          .then((text): playerInterface => {
            let json = JSON.parse(text);
            return {
              name: json.firstName + " " + json.lastName,
              number: json.number,
              points: 0,
              image: json.profileBig,
              boughtFor: 0,
              marketV: json.marketValue,
              averagePoints: json.averagePoints,
              position: this.matchPlayerNumber(json.position),
              id: json.id,
              teamId: json.teamId
            }
          })
        // let _player: playerInterface = {
        //   name: "",
        //   number: 0,
        //   points: 0,
        //   image: '',
        //   boughtFor: 0,
        //   marketV: 0,
        //   averagePoints: 0,
        //   position: '',
        //   id: 0,
        //   teamId: ''
        // };
        // return _player;
      })
      .catch((error) => {
        this.reset();
        return undefined;
      })
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
      .catch((error) => {
        this.reset();
        return "undefined";
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
      .catch((error) => {
        this.reset();
        return "";
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

  async getMarket(): Promise<playerInterface[]> {
    console.log('Getting market')
    let players: playerInterface[] = [];
    const request = await fetch(`https://europe-west1-kickbase-dashboard.cloudfunctions.net/getMarket?token=${this.token}&leagueId=${this.leagueId}`)
      .then(async (text) => {
        let rawText = await text.text()
          .then((res) => {
            let json = JSON.parse(res);
            for (let player of json.players) {
              players.push({
                name: player.firstName + " " + player.lastName,
                number: player.number,
                points: player.totalPoints,
                image: `https://kickbase.b-cdn.net/pool/playersbig/${player.id}.png`,
                boughtFor: 0,
                marketV: player.marketValue,
                averagePoints: player.averagePoints,
                position: this.matchPlayerNumber(player.position),
                id: player.id,
                teamId: player.teamId,
                status: player.status === "0" ? "Fit" : "Check",
                trend: player.marketValueTrend,
                endsIn: player.expiry
              })
            }
          })
      })
      .catch((error) => {
        this.reset();
        return undefined;
      })
    console.log(players);

    return players;
  }
}
