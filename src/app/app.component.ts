import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { LegendPosition, Color, ColorHelper, ScaleType } from "@swimlane/ngx-charts";
import {GeneralStorageService} from "../services/general-storage.service";
import {Dota2OpenApiService} from "../services/dota2-open-api.service";
import { HeroStat } from "../interfaces/hero-stat";

@Component({
  selector: 'app-winrate-heroes',
  templateUrl: './winrate-heroes.component.html',
  styleUrls: ['./winrate-heroes.component.css']
})
export class WinrateHeroesComponent implements OnInit {

  heroWRData = [] as any[];
  pageLoaded: boolean = false;
  view;
  heroStats: HeroStat[] = [] as HeroStat[];
  legendPosition = LegendPosition.Right;
  attributes = [] as string[];
  roles = [] as string[];
  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#ef4444', '#84cc16', '#0ea5e9'],
  };

  public legendData = ['Strength', 'Agility', 'Blue'];
  public legendColors = new ColorHelper(this.colorScheme, ScaleType.Ordinal, [], null);

  constructor(
    private dota2OpenApi: Dota2OpenApiService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    this.view = [500, 500];
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
            } as HeroStat;
            this.heroStats.push(heroStat);

            // Calculate win rate and push to hero win rate data
            this.heroWRData.push({ name: x.localized_name, value: (+heroStat.herald_win / +heroStat.herald_pick) * 100 });
          });
        }
      },
      complete: () => {
        this.updateChart(this.heroWRData);
        GeneralStorageService.heroes = this.heroStats;
        this.pageLoaded = true;
        this.view = [innerWidth / 1.20, 30 * this.heroWRData.length];
        this.spinner.hide();
      }
    });
  }

  // Update hero win rate chart data
  private updateChart(data: any[]) {
    this.heroWRData = [...data.sort((a, b) => {
      if (+a.value > +b.value) {
        return -1;
      }
      if (+a.value < +b.value) {
        return 1;
      }
      return 0;
    })];

    this.view = [innerWidth / 1.20, 30 * this.heroWRData.length];
  }

  // Generate series array for a hero's win rate based on roles
  private GenerateSeriesArray(heroStat: HeroStat) {
    let winrate = (+heroStat.herald_win / +heroStat.herald_pick) * 100;
    let roles = heroStat.roles;
    let seriesArr = [] as any[];

    for (const rolesKey in roles) {
      seriesArr.push({ name: roles[rolesKey], value: winrate / roles.length });
    }
    return seriesArr;
  }

  // Handle hero selection from chart
  onSelect(event) {
    console.log(event);
    let hero = this.heroStats.find(x =>
      x.name == event.name);
    if (hero) {
      console.log(hero.id);
      this.router.navigate(['Matchup', hero.id]);
    }
  }

  // Update hero win rate chart data based on selected attributes
  updateDataAttr(attributes: string[]) {
    this.attributes = attributes;
    var tmpHeroWRData = [] as any[];

    this.heroStats.map(x => {
      if ((attributes.includes(x.primary_attr) || attributes.includes('All')) &&
        (this.checker(x.roles, this.roles) || this.roles.includes('All'))) {
        tmpHeroWRData.push({ name: x.name, value: (+x.herald_win / +x.herald_pick) * 100 });
      }
    });
    this.updateChart(tmpHeroWRData);
  }

  // Update hero win rate chart data based on selected roles
  updateDataRoles(roles: string[]) {
    this.roles = roles;
    let tmpHeroWRData = [] as any[];

    this.heroStats.map(x => {
      if ((this.attributes.includes(x.primary_attr) || this.attributes.includes('All')) &&
        (this.checker(x.roles, roles)) || roles.includes('All')) {
        tmpHeroWRData.push({ name: x.name, value: (+x.herald_win / +x.herald_pick) * 100 });
      }
    });
    this.updateChart(tmpHeroWRData);
  }

  // Handle window resize
  onResize(event) {
    this.view = [event.target.innerWidth / 1.20, 30 * this.heroWRData.length];
  }

  // Check if an array contains all elements of another array
  checker = (arr, target) => target.every(v => arr.includes(v));

  // Define custom colors for hero attributes
  customColors = (name) => {
    let hero = this.heroStats.find(x => x.name == name);
    if (hero?.primary_attr === 'agi') {
      return '#84cc16'; // Green for Agility heroes
    } else if (hero?.primary_attr === 'str') {
      return '#ef4444'; // Red for Strength heroes
    } else {
      return '#0ea5e9'; // Blue for Intelligence heroes
    }
  }

  // Get hero roles for display
  getRoles(heroName: string) {
    let hero = this.heroStats?.find(x => x.name == heroName);
    return `${heroName} is a ${hero?.primary_attr} hero and their roles are: ${hero?.roles.join('-')}`;
  }
}
