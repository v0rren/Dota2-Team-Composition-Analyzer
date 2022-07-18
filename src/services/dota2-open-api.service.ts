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

getHeroMatchup(id : string) : Observable<any>
{
  return this.httpClient.get(this.baseUrl.concat('/heroes/').concat(id).concat('/matchups'))
}

getFindMatches(teamA : string[], teamB :string[]) : Observable<any>{

    let request = this.baseUrl +'/findMatches?';

  for (const index in teamA) {
    request =  request + 'teamA=' + teamA[index] + '&';

  }
  for (const index in teamB) {
    request = request + 'teamB=' + teamB[index]+ '&';

  }
    return this.httpClient.get(request)

}
}
