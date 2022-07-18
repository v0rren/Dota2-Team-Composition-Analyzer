import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Dota2OpenApiService} from "../../../services/dota2-open-api.service";
import {NgxSpinnerService} from "ngx-spinner";
import {GeneralStorageService} from "../../../services/general-storage.service";
import {HeroStat} from "../../../interfaces/hero-stat";
import {Color, ColorHelper, LegendPosition, ScaleType} from "@swimlane/ngx-charts";
import {find} from "rxjs";

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
  heroesTeam = [] as string[];
  enemyTeam = [] as string[];
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
           // this.heroWRData.push({name: x.localized_name, value: (+heroStat.herald_win / +heroStat.herald_pick) * 100});
          });
        }
      },
      complete: () => {
        GeneralStorageService.heroes = this.heroStats;
        this.pageLoaded = true;
        this.view = [innerWidth / 500]
        this.spinner.hide();
      }
    })
  }

  private updateChart() {
    let heroesMap = new Map<string,[number,number]>;
    this.spinner.show();
    this.dota2OpenApi.getFindMatches(this.heroesTeam,this.enemyTeam).subscribe({
      next: (data) => {
        if (data) {

          data.map( match => {
            let teamA = match.teama;
            let teamB = match.teamb;
            if(this.checker(teamA,this.heroesTeam) && this.heroesTeam.length > 0 ){
              // remove heroes already selected
              for (const hero of this.heroesTeam) {
                teamA.splice(teamA.indexOf(hero),1);
              }

              for (const heroA of teamA) {
                if(heroesMap.has(heroA)){
                  let v = heroesMap.get(heroA)
                  if (v) {
                    heroesMap.set(heroA, [match.teamawin ? v[0] + 1 : v[0], v[1] + 1])
                  }
                }
                else {
                  heroesMap.set(heroA, [match.teamawin ? 1 : 0, 1])
                }
              }

            }
            else{
              for (const hero of this.heroesTeam) {
                teamB.splice(teamB.indexOf(hero),1);
              }

              for (const heroB of teamB) {
                if(heroesMap.has(heroB)){
                  let v = heroesMap.get(heroB)
                  if (v) {
                    heroesMap.set(heroB, [match.teamawin ?  v[0] : v[0] + 1 , v[1] + 1])
                  }
                }
                else {
                  heroesMap.set(heroB, [match.teamawin ? 0: 1, 1])
                }
              }
            }

          })


        }
      },
      complete: () => {
        let tmpherostats = [] as any[]

        heroesMap.forEach((value: [number ,number ], key: string) => {
          if(this.heroesTeam.indexOf(key) == -1 && this.enemyTeam.indexOf(key) == -1) {
            let hero = this.heroStats.find(h => h.id === key);
            if (hero) {
              let winrate = +value[0] / +value[1];
              if (winrate != 0)
                tmpherostats.push({name: hero.name, value: (+value[0] / +value[1]) * 100});
            }
          }
          this.spinner.hide();
        });

        this.heroWRData = [...tmpherostats.sort((a, b) => {
          if (+a.value > +b.value) {
            return -1;
          }
          if (+a.value < +b.value) {
            return 1;
          }
          // a must be equal to b
          return 0;
        })]

        this.view = [innerWidth / 1.20,500]
      }


    })



  }



  onSelect(event) {
    console.log(event);
  }

  updateTeam(team: string) {

    const heroCode = this.heroStats.find( h => h.name == team)?.id;

    if (heroCode != null) {
      const index = this.heroesTeam.indexOf(heroCode);

      if(index != -1)
        this.heroesTeam.splice(index,1);
      else
        this.heroesTeam.push(heroCode);

      this.updateChart();}
  }


  updateEnemyTeam(enemy: string) {

    const heroCode = this.heroStats.find( h => h.name == enemy)?.id;

    if (heroCode != null) {
      const index = this.enemyTeam.indexOf(heroCode);
      if(index != -1)
        this.enemyTeam.splice(index,1);
      else
        this.enemyTeam.push(heroCode);

      this.updateChart();}  }

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
