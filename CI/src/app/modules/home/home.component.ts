import { Component } from "@angular/core";
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
  templateUrl: "home.component.html",
  styleUrls: ["home.component.css"]
})

export class HomeComponent {
  user: UserModel = new UserModel();
  profileForm: FormGroup;
  githubApiService: GithubApiService = new GithubApiService(this.httpClient);
  username: string;
  userAvatarURL: string;

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private location: Location,
    private httpClient: HttpClient,
    private data: DataService,
    private router: Router
  ) { }

}
