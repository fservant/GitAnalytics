import { Component, OnInit } from "@angular/core";
import { UserService } from "../core/user.service";
import { AuthService } from "../core/auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { FormGroup } from "@angular/forms";
import { UserModel } from "../core/user.model";
import { HttpClient } from "@angular/common/http";
import { GithubApiService } from "../services/github-api-service";
import { DataService } from "../services/shared-service";
import { RepoSharedService } from "../services/repo-shared-service";

@Component({
  selector: "page-user",
  templateUrl: "user.component.html",
  styleUrls: ["user.scss"]
})
export class UserComponent implements OnInit {
  user: UserModel = new UserModel();
  profileForm: FormGroup;
  githubApiService: GithubApiService = new GithubApiService(this.httpClient);
  loginName: string;
  repos: any;

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private location: Location,
    private httpClient: HttpClient,
    private data: DataService,
    private repoData: RepoSharedService,
    private router: Router
  ) { this.data.current.subscribe(name => this.loginName = name); }

  displayRepos() {
    this.repos = this.user.repos;
  }

  setup() {
    //Sets picture and name
    this.route.data.subscribe(routeData => {
      let data = routeData["data"];
      if (data) {
        this.user = data;
      }
    });
    //setup github login name
    this.user.username = this.loginName;
    //Get repo names (Use Alibaba to test over 200 repos)
    this.githubApiService.getUserRepositoryList(this.user.username).then(res => {
      this.user.repos = res;
      this.displayRepos();
    });
  }

  ngOnInit(): void {
    if (this.loginName === "default name") {
      this.tryGithubLogin();
    } else {
      this.setup();
    }
  }

  tryGithubLogin() {
    this.authService.doGithubLogin().then(res => {
      this.data.changeValue(res);
      this.setup();
    },
    err => {
      console.log(err);
      this.router.navigate(["login"]);
    });
  }

  logout() {
    this.authService.doLogout().then(
      res => {
        this.router.navigate(["login"]);
      },
      error => {
        console.log("Logout error", error);
      }
    );
  }

  cardOnClick(repoName: string) {
    this.repoData.changeValue(repoName);
    this.router.navigate(["/repo"]);
  }
}
