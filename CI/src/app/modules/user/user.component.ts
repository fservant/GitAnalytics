import { Component, OnInit } from "@angular/core";
import { UserService } from "../../core/http/user/user.service";
import { AuthService } from "../../core/authentication/auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { FormGroup } from "@angular/forms";
import { UserModel } from "../../models/user.model";
import { HttpClient } from "@angular/common/http";
import { GithubApiService } from "../../core/services/github-api-service";
import { DataService } from "../../core/services/data-service";
import '../../../assets/css/styles.css';

@Component({
  selector: "page-user",
  templateUrl: "user.component.html",
  styleUrls: ["user.component.css"]
})
export class UserComponent implements OnInit {
  user: UserModel = JSON.parse(localStorage.getItem("currentUser"));
  profileForm: FormGroup;
  githubApiService: GithubApiService = new GithubApiService(this.httpClient);
  repos: any;
  userAvatarURL: string
  loginname: string;

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private location: Location,
    private httpClient: HttpClient,
    private data: DataService,
    private router: Router
  ) { this.data.current.subscribe(name => this.loginname = name); }

  displayRepos() {
    this.repos = JSON.parse(localStorage.getItem("currentUserRepos"));
  }

  setup() {
    debugger;
     //Sets picture and name
     this.route.data.subscribe(routeData => {
      let data = routeData["data"];
      if (data) {
        this.user = data;
      }
    });
    //setup github login name
    this.user.username = localStorage.getItem("username");
    //Get repo names (Use Alibaba to test over 200 repos)
    this.githubApiService.getUserRepositoryList(this.user.username).then(res => {
      this.user.repos = res;
      this.displayRepos();
    });
    debugger;
  }

  ngOnInit(): void {
    debugger;
    if (localStorage.getItem("username") !== "default name") {
      this.setup();
    }
  }

  logout() {
    this.authService.doLogout().then(
      res => {
        this.location.back();
      },
      error => {
        console.log("Logout error", error);
      }
    );
  }
}