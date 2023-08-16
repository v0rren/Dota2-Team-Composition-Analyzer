import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dota2OpenApiService } from "../../services/dota2-open-api.service";
import { GeneralStorageService } from "../../services/general-storage.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Color, ColorHelper, ScaleType } from "@swimlane/ngx-charts";
import { HeroStat } from "../../interfaces/hero-stat";

@Component({
  selector: 'app-matchup',
  templateUrl: './matchup.component.html',
  styleUrls: ['./matchup.component.css']
})
export class MatchupComponent implements OnInit {

  public heroWRData = [] as any[];
  view;
  public heroStats = [] as HeroStat[];

  public heroId;
  public heroName;
  pageLoaded: boolean = false;
  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#ef4444', '#84cc16', '#0ea5e9'],
  };

  public legendData = ['Strength', 'Agility', 'Blue'];
  public legendColors = new ColorHelper(this.colorScheme, ScaleType.Ordinal, [], null);

  constructor(
    private activatedroute: ActivatedRoute,
    private dota2OpenApi: Dota2OpenApiService,
    private spinner: NgxSpinnerService
  ) {
    this.view = [innerWidth / 1.05, 1500];
    this.heroStats = GeneralStorageService._heroes;
  }

  ngOnInit(): void {
    this.spinner.show();

    // Fetch hero ID from route parameters
    this.activatedroute.paramMap.subscribe(params => {
      this.heroId = params.get('id');
    });

    // Fetch hero matchup data using API service
    this.dota2OpenApi.getHeroMatchup(this.heroId).subscribe({
      next: (data) => {
        let heroStat = GeneralStorageService._heroes;
        this.heroName = heroStat.find(hero => hero.id == this.heroId)?.name;

        if (data) {
          data.map(x => {
            let hero = heroStat.find(hero => hero.id == x.hero_id);
            this.heroWRData.push({ name: hero?.name, value: (x['wins'] / x['games_played']) * 100 });
          });
        }
      },
      complete: () => {
        this.updateChart(this.heroWRData);
        this.pageLoaded = true;
        this.spinner.hide(); // Hide spinner after data is loaded
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
  }

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
