import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MatchupComponent} from "./matchup/matchup.component";
import {WinrateHeroesComponent} from "./winrate-heroes/winrate-heroes.component";
import {HeroesSuggestionComponent} from "./components/heroes-suggestion/heroes-suggestion.component";

const routes: Routes = [
  { path: 'WinrateHeroes', component: WinrateHeroesComponent },
  { path: 'Matchup/:id', component: MatchupComponent },
  { path: 'HeroPicker', component: HeroesSuggestionComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
