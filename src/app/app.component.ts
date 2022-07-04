import { Component } from '@angular/core';
import {Dota2OpenApiService} from "../services/dota2-open-api.service";
import {HeroStat} from "../interfaces/hero-stat";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  heroesWRData = [
    { name: "Ursa", value: 66 },
    { name: "Magnus", value: 52 },
    { name: "Slark", value: 43 },
    { name: "Drow", value: 90 },
    { name: "Pudge", value: 20 }
  ];
  heroStats: HeroStat[] = [] as HeroStat[];


  constructor(private dota2OpenApi: Dota2OpenApiService) {
  }

  ngOnInit(): void {

    this.dota2OpenApi.getHeroStats().subscribe({
      next: (data) => {
        if (data) {
          data.map( x => {
              this.heroStats.push( {
                  id : x.id,

                } as HeroStat
              )
          });
        }
      }
    })
  }
}
