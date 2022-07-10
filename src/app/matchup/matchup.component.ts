import {Component, NgModule, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Dota2OpenApiService} from "../../services/dota2-open-api.service";
import {GeneralStorageService} from "../../services/general-storage.service";
import {MatCard} from "@angular/material/card";
import { MatCardModule } from '@angular/material/card';
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-matchup',
  templateUrl: './matchup.component.html',
  styleUrls: ['./matchup.component.css']
})


export class MatchupComponent implements OnInit {

  public heroWRData = [] as any[];

  public heroId;
  public heroName;
  pageLoaded: boolean = false;
  constructor(private activatedroute:ActivatedRoute,
              private dota2OpenApi: Dota2OpenApiService,
              private spinner: NgxSpinnerService)
  { }

  ngOnInit(): void {
    this.spinner.show();
    this.activatedroute.paramMap.subscribe(params => {
      this.heroId = params.get('id');
    });


    this.dota2OpenApi.getHeroMatchup(this.heroId).subscribe({
      next: (data) => {
        let heroStat = GeneralStorageService._heroes;
        this.heroName = heroStat.find( hero => hero.id == this.heroId )?.name;
        if (data) {
          data.map( x => {
            let hero = heroStat.find( hero => hero.id == x.hero_id );
            this.heroWRData.push({name:  hero?.name, value:  ( x['wins']/ x['games_played'] )* 100});

          })
        }
      },
      complete: () => {
        this.heroWRData = [...this.heroWRData];
        this.pageLoaded = true;
        this.spinner.hide();
      }
    })
  }

}
