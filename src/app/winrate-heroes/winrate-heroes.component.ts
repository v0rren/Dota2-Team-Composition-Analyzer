import { Component, OnInit } from '@angular/core';
import {HeroStat} from "../../interfaces/hero-stat";
import {Dota2OpenApiService} from "../../services/dota2-open-api.service";
import {Router} from "@angular/router";
import {GeneralStorageService} from "../../services/general-storage.service";
import { NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-winrate-heroes',
  templateUrl: './winrate-heroes.component.html',
  styleUrls: ['./winrate-heroes.component.css']
})
export class WinrateHeroesComponent implements OnInit {

  heroWRData = [] as any[]
  pageLoaded: boolean = false;
  view;
  heroStats: HeroStat[] = [] as HeroStat[];

  attributes = [] as string[];
  roles = [] as string[];

  constructor(private dota2OpenApi: Dota2OpenApiService,
              private router: Router,
              private spinner: NgxSpinnerService) {

    this.view = [innerWidth / 1.05, 700]
  }

  ngOnInit(): void {

    this.spinner.show();
    this.attributes.push('All');
    this.roles.push('All');

    this.dota2OpenApi.getHeroStats().subscribe({
      next: (data) => {
        if (data) {
          data.map(x => {
            let heroStat = {
              id: x.id,
              name: x.localized_name,
              primary_attr: x.primary_attr,
              attack_type: x.attack_type,
              roles: x.roles,
              herald_pick: x['1_pick'],
              herald_win: x['1_win'],
            } as HeroStat
            this.heroStats.push(heroStat)


            let seriesArr = this.GenerateSeriesArray(heroStat);


            this.heroWRData.push({name: x.localized_name, series: seriesArr});
          });
        }
      },
      complete: () => {
        this.heroWRData = [...this.heroWRData];
        GeneralStorageService.heroes = this.heroStats;
        this.pageLoaded = true;
        this.spinner.hide();
      }
    })
  }

  private GenerateSeriesArray(heroStat: HeroStat) {
    let winrate = (+heroStat.herald_win / +heroStat.herald_pick) * 100;

    let roles = heroStat.roles;

    let seriesArr = [] as any[];

    for (const rolesKey in roles) {
      seriesArr.push({name: roles[rolesKey], value: winrate / roles.length})

    }
    return seriesArr;
  }

  onSelect(event) {
    console.log(event);
    let hero = this.heroStats.find(x =>
      x.name == event.series)
    if (hero) {
      console.log(hero.id);
      this.router.navigate(['Matchup', hero.id]);
    }
  }

  updateDataAttr(attributes: string[]) {

    this.attributes = attributes;
    var tmpHeroWRData = [] as any[];

    this.heroStats.map(x => {
      if ((attributes.includes(x.primary_attr) || attributes.includes('All')) && (this.checker(x.roles, this.roles) || this.roles.includes('All'))) {
        let seriesArr = this.GenerateSeriesArray(x);
        tmpHeroWRData.push({name: x.name, series: seriesArr});
      }
    })
    this.heroWRData = [...tmpHeroWRData]
  }


  updateDataRoles(roles: string[]) {
    this.roles = roles;
    let tmpHeroWRData = [] as any[];

    this.heroStats.map(x => {
      if ((this.attributes.includes(x.primary_attr) || this.attributes.includes('All')) && (this.checker(x.roles, roles)) || roles.includes('All')) {
        let seriesArr = this.GenerateSeriesArray(x);
        tmpHeroWRData.push({name: x.name, series: seriesArr});
      }
    })
    this.heroWRData = [...tmpHeroWRData]
  }

  onResize(event) {
    this.view = [event.target.innerWidth / 1.05, 5000];
  }

  //Check if array contains all elements of another array
  checker = (arr, target) => target.every(v => arr.includes(v));

}
