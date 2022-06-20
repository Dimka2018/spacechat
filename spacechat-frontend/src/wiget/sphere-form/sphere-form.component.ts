import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'sphere-form',
  templateUrl: './sphere-form.component.html',
  styleUrls: ['./sphere-form.component.scss']
})
export class SphereFormComponent{

  @Input("color")
  public color: string = 'white'

  constructor(private router: Router) {
  }


}
