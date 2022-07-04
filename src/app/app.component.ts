import { Component } from '@angular/core';
import {Dota2OpenApiService} from "../services/dota2-open-api.service";
import {HeroStat} from "../interfaces/hero-stat";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  heroWRData=  [] as any[]
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

            this.heroWRData.push({name: x.localized_name, value:  ( x['1_win']/ x['1_pick'] )* 100});
            this.heroStats.push( {
                  id : x.id,
                  name: x.localized_name,
                  primary_attr: x.primary_attr,
                  attack_type: x.attack_type,
                  roles: x.roles,
                  herald_pick: x['1_pick'],
                  herald_win: x['1_win'],
                } as HeroStat

              )

          });
        }
      },
      complete: () => { this.heroWRData = [...this.heroWRData];
      }
    })
  }
}
