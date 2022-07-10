import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {HttpClientModule} from "@angular/common/http";
import {FilterBarComponent} from "./components/filter-bar/filter-bar.component";
import {MatFormField, MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatSelect, MatSelectModule, MatSelectTrigger} from "@angular/material/select";
import {MatOption, MatOptionModule} from "@angular/material/core";
import {FormsModule,ReactiveFormsModule} from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import { MatchupComponent } from './matchup/matchup.component';
import {RouterModule} from "@angular/router";
import { WinrateHeroesComponent } from './winrate-heroes/winrate-heroes.component';
import { MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {NgxSpinnerModule} from "ngx-spinner";

@NgModule({
  declarations: [
    AppComponent,
    FilterBarComponent,
    MatchupComponent,
    WinrateHeroesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    HttpClientModule,
    MatSelectModule,
    MatOptionModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    RouterModule,
    MatCardModule,
    MatInputModule,
    NgxSpinnerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
