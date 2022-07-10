import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MatchupComponent} from "./matchup/matchup.component";
import {WinrateHeroesComponent} from "./winrate-heroes/winrate-heroes.component";

const routes: Routes = [
  { path: 'WinrateHeroes', component: WinrateHeroesComponent },
  { path: 'Matchup', component: MatchupComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
