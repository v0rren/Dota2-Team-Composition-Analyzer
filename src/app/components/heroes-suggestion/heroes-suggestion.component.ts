import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Dota2OpenApiService} from "../../../services/dota2-open-api.service";
import {NgxSpinnerService} from "ngx-spinner";
import {GeneralStorageService} from "../../../services/general-storage.service";
import {HeroStat} from "../../../interfaces/hero-stat";
import {Color, ColorHelper, LegendPosition, ScaleType} from "@swimlane/ngx-charts";

@Component({
  selector: 'app-heroes-suggestion',
  templateUrl: './heroes-suggestion.component.html',
  styleUrls: ['./heroes-suggestion.component.css']
})
export class HeroesSuggestionComponent implements OnInit {


  heroWRData = [] as any[]
  pageLoaded: boolean = false;
  view;
  heroStats: HeroStat[] = [] as HeroStat[];
  legendPosition = LegendPosition.Right
  attributes = [] as string[];
  roles = [] as string[];
  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#C85C41', '#38573E', '#4D80A8'],
  };

  public legendData =  ['Strength', 'Agility', 'Blue'];
  //public legendColors = new colorH ['#C85C41', '#38573E', '#4D80A8'];
  public legendColors = new ColorHelper(this.colorScheme, ScaleType.Ordinal, [], null)
  constructor(private dota2OpenApi: Dota2OpenApiService,
              private router: Router,
              private spinner: NgxSpinnerService) {

    this.view = [500, 500]
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


            this.heroWRData.push({name: x.localized_name, value: (+heroStat.herald_win / +heroStat.herald_pick) * 100});
          });
        }
      },
      complete: () => {
        this.updateChart(this.heroWRData);
        GeneralStorageService.heroes = this.heroStats;
        this.pageLoaded = true;
        this.view = [innerWidth / 1.20, 30*this.heroWRData.length]
        this.spinner.hide();
      }
    })
  }

  private updateChart(data: any[]) {
    this.heroWRData = [...data.sort((a, b) => {
      if (+a.value > +b.value) {
        return -1;
      }
      if (+a.value < +b.value) {
        return 1;
      }
      // a must be equal to b
      return 0;
    })]

    this.view = [innerWidth / 1.20, 30*this.heroWRData.length]

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
      x.name == event.name)
    if (hero) {
      console.log(hero.id);
      this.router.navigate(['Matchup', hero.id]);
    }
  }

  updateTeam(team: string) {



  }


  updateEnemyTeam(enemy: string) {

  }

  onResize(event) {
    this.view = [event.target.innerWidth / 1.20, 30*this.heroWRData.length];
  }

  //Check if array contains all elements of another array
  checker = (arr, target) => target.every(v => arr.includes(v));

  customColors = (name) => {

    let hero = this.heroStats.find(x => x.name == name);
    if(hero?.primary_attr === 'agi'){
      return '#38573E'
    }
    else if ( hero?.primary_attr === 'str'){
      return '#C85C41'
    }
    else return '#4D80A8'
  }


  getRoles(heroName: string) {

    let hero = this.heroStats?.find(x => x.name == heroName);
    return heroName + " is a " + hero?.primary_attr+ " hero and his roles are: " + hero?.roles.join('-');
  }
}
