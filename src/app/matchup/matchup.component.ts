import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-matchup',
  templateUrl: './matchup.component.html',
  styleUrls: ['./matchup.component.css']
})
export class MatchupComponent implements OnInit {

  public heroId;
  constructor(private activatedroute:ActivatedRoute)
  { }

  ngOnInit(): void {
    this.activatedroute.paramMap.subscribe(params => {
      this.heroId = params.get('id');
    });
  }

}
