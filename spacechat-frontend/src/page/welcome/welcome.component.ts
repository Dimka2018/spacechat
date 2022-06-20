import {AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Router} from "@angular/router";
import {Star} from "../../wiget/sphere-form/star";
import {User} from "../../entity/User";
import {RegistrationRequest} from "../../entity/RegistrationRequest";
import {UserService} from "../../service/user.service";

@Component({
  selector: 'welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss', './sign-in-form.scss', './sign-up-form.scss', './sky.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WelcomeComponent implements OnInit {

  stars: Star[] = [];
  user: User = new User();
  registrationRequest: RegistrationRequest = new RegistrationRequest();

  stageClasses: string[] = ['left', 'front', 'right', 'back']

  constructor(private router: Router, private userService: UserService) {
  }

  ngOnInit(): void {
    this.initSky();
  }

  login() {
    this.userService.login(this.user)
      .subscribe(() => this.router.navigate([`/chat`]))
  }

  register() {
    this.userService.register(this.registrationRequest)
      .subscribe(response => {
        if (response.success) {
          this.router.navigate([`/chat`])
        }
      })
  }

  swapRight() {
    let array = [];
    for (let i = 0; i < this.stageClasses.length; i++) {
      if (i === 0) {
        array.push(this.stageClasses[this.stageClasses.length - 1])
      } else {
        array.push(this.stageClasses[i - 1])
      }
    }
    this.stageClasses = array
  }

  swapLeft() {
    let array = [];
    for (let i = 0; i < this.stageClasses.length; i++) {
      if (i === this.stageClasses.length - 1) {
        array.push(this.stageClasses[0])
      } else {
        array.push(this.stageClasses[i + 1])
      }
    }
    this.stageClasses = array
  }

  initSky() {
    const x = window.innerWidth / 2
    const y = window.innerHeight / 2;
    for (let i = 1; i < 360; i++) {
      const size = Math.round(Math.random() + 2)
      let star: Star = new Star(size, i, x, y)
      this.stars.push(star);
    }
  }

}
