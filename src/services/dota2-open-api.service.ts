import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class Dota2OpenApiService {

  private baseUrl = 'https://api.opendota.com/api';
  constructor(private httpClient: HttpClient) { }



getHeroStats(): Observable<any> {
  return this.httpClient.get(this.baseUrl.concat('/heroStats'));
}

}
