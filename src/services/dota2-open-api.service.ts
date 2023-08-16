import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Dota2OpenApiService {

  private baseUrl = 'https://api.opendota.com/api';

  constructor(private httpClient: HttpClient) { }

  // Get hero statistics
  getHeroStats(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/heroStats`);
  }

  // Get hero matchup information based on ID
  getHeroMatchup(id: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/heroes/${id}/matchups`);
  }

  // Find matches between two teams
  getFindMatches(teamA: string[], teamB: string[]): Observable<any> {
    let request = `${this.baseUrl}/findMatches?`;

    // Construct the request URL for team A
    for (const index in teamA) {
      request = request + `teamA=${teamA[index]}&`;
    }

    // Construct the request URL for team B
    for (const index in teamB) {
      request = request + `teamB=${teamB[index]}&`;
    }

    return this.httpClient.get(request);
  }
}
