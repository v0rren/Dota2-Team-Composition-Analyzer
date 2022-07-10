import { Component } from '@angular/core';
import {Dota2OpenApiService} from "../services/dota2-open-api.service";
import {HeroStat} from "../interfaces/hero-stat";
import {Subject} from "rxjs";
import {Router, RouterLink} from "@angular/router";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.router.navigate(['WinrateHeroes']);
  }
}
