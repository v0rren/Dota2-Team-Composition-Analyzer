import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.css']
})
export class FilterBarComponent implements OnInit {
  @Input()  heroType = new FormControl(['All']);
  @Input()  heroRole = new FormControl(['All']);

  @Output() heroTypeChanged: EventEmitter<string[]> =   new EventEmitter();
  @Output() heroRoleChanged: EventEmitter<string[]> =   new EventEmitter();

  heroTypeList: string[] = ['All', 'str', 'int', 'agi'];
  heroRoleList: string[] = ['All', 'Carry', 'Escape', 'Nuker','Durable','Support','Disabler','Initiator'];

  constructor() { }

  ngOnInit(): void {

    this.heroType.valueChanges.subscribe( value => {
      if(value){
        this.heroTypeChanged.emit(value)
      }
    })

    this.heroRole.valueChanges.subscribe( value => {
      if(value){
        this.heroRoleChanged.emit(value)
      }
    })
  }

}
