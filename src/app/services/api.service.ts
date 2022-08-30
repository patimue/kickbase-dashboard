import { Injectable } from '@angular/core';
import { userInfo } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  users : userInfo[] = [];

  constructor() { }

  getMatchDay(leagueId: string, token: string) {
    fetch(`https://europe-west1-kickbase-dashboard.cloudfunctions.net/getMatchDay?token=${token}&leagueId=${leagueId}`, {
      method: "GET",
      redirect: "follow"
    })
      .then((res) => {
        if (res.status === 200) {
          res.text()
            .then((text) => {
              console.log(text);
              const json = JSON.parse(text);
              let array = [];
              for (let user of json.u) {
                array.push({
                  name: user.n,
                  positive: user.b,
                  points: user.t,
                  stats: user.st,
                  picture: user.i,
                  players: []
                })
              }
            })
        } else {
          console.log('error');
        }
      })
      .catch((error) => {
        return undefined
        console.log(error);
      })
  }
}