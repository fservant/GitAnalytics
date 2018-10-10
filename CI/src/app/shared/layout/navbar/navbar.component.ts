import { Component, OnInit } from '@angular/core';
import { UserService } from "../../../core/http/user/user.service"; 
import { AuthService } from "../../../core/authentication/auth.service";
import { DataService } from "../../../core/services/data-service";

@Component({
  selector: 'layout-navbar',
  templateUrl: './navbar.component.html'
})

export class NavbarComponent implements OnInit {
  loginname: String 

  constructor(public userService: UserService, public authService: AuthService, private data: DataService) { 
    this.loginname = localStorage.getItem("username");
    debugger;
  }

  setup() {
    this.loginname = localStorage.getItem("username");
  }

  ngOnInit(): void {
    debugger;
    if (localStorage.getItem("username") !== "default name") {
      this.setup();
    }
  }

  
}