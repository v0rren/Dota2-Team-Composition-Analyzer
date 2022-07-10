import { Component, OnInit } from '@angular/core';
import {HeroStat} from "../../interfaces/hero-stat";
import {Dota2OpenApiService} from "../../services/dota2-open-api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-winrate-heroes',
  templateUrl: './winrate-heroes.component.html',
  styleUrls: ['./winrate-heroes.component.css']
})
export class WinrateHeroesComponent implements OnInit {

  heroWRData=  [] as any[]
  heroesWRData = [
    { name: "Ursa", value: 66 },
    { name: "Magnus", value: 52 },
    { name: "Slark", value: 43 },
    { name: "Drow", value: 90 },
    { name: "Pudge", value: 20 }
  ];
  heroStats: HeroStat[] = [] as HeroStat[];

  attributes = [] as string[];
  roles = [] as string[];
  constructor(private dota2OpenApi: Dota2OpenApiService,
              private router: Router) {
  }

  ngOnInit(): void {

    this.attributes.push('All');
    this.roles.push('All');
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
  onSelect(event) {
    console.log(event);
    let hero = this.heroStats.find( x =>
      x.name == event.label)
    if(hero) {
      console.log(hero.id);
      this.router.navigate(['Matchup',hero.id]);
    }
  }
  updateDataAttr(attributes : string[]){

    this.attributes = attributes;
    var tmpHeroWRData = [] as any[];

    this.heroStats.map( x => {
      if((attributes.includes(x.primary_attr) || attributes.includes('All')) && (this.checker(x.roles,this.roles) || this.roles.includes('All')))
        tmpHeroWRData.push({name: x.name, value:  ( +x.herald_win / +x.herald_pick )* 100});
    })
    this.heroWRData = [...tmpHeroWRData]
  }

  //Check if array contains all elements of another array
  checker = (arr, target) => target.every(v => arr.includes(v));

  updateDataRoles(roles : string[]){
    this.roles = roles;
    let tmpHeroWRData = [] as any[];

    this.heroStats.map( x => {
      if((this.attributes.includes(x.primary_attr) || this.attributes.includes('All')) && (this.checker(x.roles,roles)) || roles.includes('All'))
        tmpHeroWRData.push({name: x.name, value:  ( +x.herald_win / +x.herald_pick )* 100});
    })
    this.heroWRData = [...tmpHeroWRData]
  }
}
