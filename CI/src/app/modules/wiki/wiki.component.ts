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
  selector: "page-wiki",
  templateUrl: "wiki.component.html",
  styleUrls: ["wiki.component.css"]
})
export class WikiComponent implements OnInit {
  user: UserModel = new UserModel();
  profileForm: FormGroup;
  githubApiService: GithubApiService = new GithubApiService(this.httpClient);
  loginName: string;
  userAvatarURL: string;

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private location: Location,
    private httpClient: HttpClient,
    private data: DataService,
    private router: Router
  ) { this.data.current.subscribe(name => this.loginName = name); }

  displayUserAvatar() {
    this.userAvatarURL = "https://github.com/" + this.user.username + ".png";
  }

  navToUserProfile() {
    this.router.navigate(["/user"]);
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
      this.displayUserAvatar();
    });
    //document.getElementById("userAvatar").addEventListener("click", this.navToUserProfile);
  }

  ngOnInit(): void {

  }

}