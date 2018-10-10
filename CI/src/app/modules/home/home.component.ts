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

@Component({
  selector: "page-home",
  templateUrl: "home.component.html"
})

export class HomeComponent implements OnInit {
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
    this.userAvatarURL = "https://github.com/" + this.loginName + ".png";
  }

  navToUserProfile() {
    this.router.navigate(["/user"]);
  }

  display(): void {
    this.displayUserAvatar();
  }

  ngOnInit(): void {
    if (this.loginName !== "default name") {
      this.display();
    }
  }
}
