import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  navigate(path: string){
    this.router.navigate([path]);

  }
}
