import { Component, AfterViewInit, OnInit, ElementRef } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from "../../../core/http/user/user.service"; 
import { AuthService } from "../../../core/authentication/auth.service";
import { GithubApiService } from "../../../core/services/github-api-service";
import { HttpClient } from "@angular/common/http";


@Component({
  selector: 'layout-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ["navbar.component.css"]
})

export class NavbarComponent implements AfterViewInit, OnInit {
  private username: string;
  userImageUrl: String;
  githubApiService: GithubApiService = new GithubApiService(this.httpClient);


  constructor(
      public userService: UserService, 
      public authService: AuthService, 
      private httpClient: HttpClient, 
      private elementRef: ElementRef,
      private router: Router
    ) {
        this.username = localStorage.getItem("username");
    }

  ngAfterViewInit() {
    this.elementRef.nativeElement.querySelector('div#dropbtn')
                                .addEventListener('click', this.displayMenu.bind(this));
    this.elementRef.nativeElement.querySelector('a#signout')
                                .addEventListener('click', this.signOut.bind(this));
    this.elementRef.nativeElement.querySelector('a#userProfile')
                                .addEventListener('click', this.navToUserProfile.bind(this));
  };


  ngOnInit() {
    this.username = localStorage.getItem("username");
    this.userImageUrl = "http://github.com/" + this.username + ".png";
    window.onclick = function (event) {
      debugger;
      if (event.target instanceof Element && !event.target.parentElement.classList.contains('dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
      }
    }
  }  

  /* When the user clicks on the button, 
  toggle between hiding and showing the dropdown content */
  displayMenu() {
    debugger;
    document.getElementById("drpdwnMenu").classList.toggle("show");
  }

  navToUserProfile() {
    this.router.navigate(["/user"]);
  }

  signOut() {
    this.authService.doLogout().then(
      res => {
        debugger;
        localStorage.clear();
        this.router.navigate(["/login"]);
    },
      error => {
        console.log("Logout error", error);
      }
    );
  }
}