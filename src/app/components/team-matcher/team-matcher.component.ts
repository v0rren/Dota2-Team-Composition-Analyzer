import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from "@angular/forms";
import { Observable, map, startWith } from "rxjs";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { HeroStat } from "../../../interfaces/hero-stat";
import { GeneralStorageService } from "../../../services/general-storage.service";

@Component({
  selector: 'app-team-matcher',
  templateUrl: './team-matcher.component.html',
  styleUrls: ['./team-matcher.component.css']
})
export class TeamMatcherComponent implements OnInit {

  separatorKeysCodes: number[] = [ENTER, COMMA];
  @Input() teamCtrl = new FormControl('');
  @Input() enemyCtrl = new FormControl('');
  filteredTeamHero: Observable<string[]>;
  filteredEnemyHero: Observable<string[]>;
  teamHeroes: string[] = [];
  enemyHeroes: string[] = [];
  allHeroes: string[] = [];
  public heroes = [] as HeroStat[];

  @ViewChild('teamHeroInput') teamHeroInput!: ElementRef<HTMLInputElement>;
  @ViewChild('enemyHeroInput') enemyHeroInput!: ElementRef<HTMLInputElement>;

  @Output() heroTeamChanged: EventEmitter<string> = new EventEmitter();
  @Output() enemyHeroChanged: EventEmitter<string> = new EventEmitter();

  constructor(private elementRef: ElementRef) {
    // Initialize heroes data
    this.heroes = GeneralStorageService._heroes;
    this.heroes.map(heroStat => this.allHeroes.push(heroStat.name));

    // Filtered observables for autocomplete
    this.filteredTeamHero = this.teamCtrl.valueChanges.pipe(
      startWith(null),
      map((heroTeam: string | null) => (heroTeam ? this._filter(heroTeam) : this.allHeroes.slice())),
    );

    this.filteredEnemyHero = this.enemyCtrl.valueChanges.pipe(
      startWith(null),
      map((enemy: string | null) => (enemy ? this._filter(enemy) : this.allHeroes.slice())),
    );
  }

  ngOnInit(): void {
    // Subscribe to changes in team and enemy controls
    this.teamCtrl.valueChanges.subscribe(value => {
      if (value) {
        this.heroTeamChanged.emit(value);
      }
    });

    this.enemyCtrl.valueChanges.subscribe(value => {
      if (value) {
        this.enemyHeroChanged.emit(value);
      }
    });
  }

  // Add hero chip to the selected list
  addHero(event: MatChipInputEvent, isTeam: boolean): void {
    const value = (event.value || '').trim();

    if (isTeam) {
      if (value) {
        this.teamHeroes.push(value);
      }
      event.chipInput!.clear();
      this.teamCtrl.setValue(null);
    } else {
      if (value) {
        this.enemyHeroes.push(value);
      }
      event.chipInput!.clear();
      this.enemyCtrl.setValue(null);
    }

    // Remove selected hero from all heroes list
    this.allHeroes = [...this.allHeroes.filter(name => name != event.value)];
  }

  // Remove hero chip from the selected list
  removeHero(hero: string, isTeam: boolean): void {
    if (isTeam) {
      const index = this.teamHeroes.indexOf(hero);
      if (index >= 0) {
        this.teamHeroes.splice(index, 1);
      }
      this.heroTeamChanged.emit(hero);
    } else {
      const index = this.enemyHeroes.indexOf(hero);
      if (index >= 0) {
        this.enemyHeroes.splice(index, 1);
      }
      this.enemyHeroChanged.emit(hero);
    }
  }

  // Select hero from autocomplete dropdown
  selected(event: MatAutocompleteSelectedEvent, isTeam: boolean): void {
    if (isTeam) {
      this.teamHeroes.push(event.option.viewValue);
      this.teamHeroInput.nativeElement.value = '';
      this.teamCtrl.setValue(null);
    } else {
      this.enemyHeroes.push(event.option.viewValue);
      this.enemyHeroInput.nativeElement.value = '';
      this.enemyCtrl.setValue(null);
    }
  }

  // Filter heroes based on user input
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allHeroes.filter(hero => hero.toLowerCase().includes(filterValue));
  }

  // Clean up when component is destroyed
  ngOnDestroy() {
    this.elementRef.nativeElement.remove();
  }
}
