import { Injectable } from '@angular/core';
import {HeroStat} from "../interfaces/hero-stat";

@Injectable({
  providedIn: 'root'
})
export class GeneralStorageService {


  static  _heroes = [] as HeroStat[];
  constructor() { }


 static get heroes(): HeroStat[] {
    return this._heroes;
  }

 static  set heroes(value: HeroStat[]) {
    this._heroes = value;
  }

}
