import { Component, OnInit } from '@angular/core';
import { UserService } from "../../../core/http/user/user.service"; 
import { AuthService } from "../../../core/authentication/auth.service";

@Component({
  selector: 'layout-navbar',
  templateUrl: './navbar.component.html'
})

export class NavbarComponent implements OnInit {
  userImageUrl: String;

  constructor(public userService: UserService, public authService: AuthService) {}

  setup() {
    this.userImageUrl = "http://github.com/" + localStorage.getItem("username") + ".png";
  }

  ngOnInit(): void {
    if (localStorage.getItem("username") !== "default name") {
      this.setup();
    }
  }
}