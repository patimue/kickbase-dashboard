import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { playerInterface } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  player: playerInterface | undefined;

  team: string = "Loading";

  playerId: string;

  finishedLoading = false;


  constructor(private apiService: ApiService, private route: ActivatedRoute) {
    this.playerId = this.route.snapshot.paramMap.get('id') ?? "";
    this.setup();
  }

  ngOnInit(): void {
  }


  async setup() {
    this.apiService.getLocal();
    this.player = await this.apiService.getPlayer(this.playerId)
    if (this.player?.teamId !== undefined)
      this.team = await this.apiService.getTeamById(this.player?.teamId);
    console.log(this.player);
    this.finishedLoading = true;
  }

  marketValueString(number: number): string {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
}
