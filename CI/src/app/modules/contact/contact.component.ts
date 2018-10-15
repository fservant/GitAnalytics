import { Component, OnInit } from "@angular/core";
import { UserService } from "../../core/http/user/user.service";
import { AuthService } from "../../core/authentication/auth.service";
import { FormGroup } from "@angular/forms";
import { UserModel } from "../../models/user.model";
import { HttpClient } from "@angular/common/http";
import { GithubApiService } from "../../core/services/github-api-service";
import '../../../assets/css/styles.css';

@Component({
  selector: "page-contact",
  templateUrl: "contact.component.html",
  styleUrls: ["contact.component.css"]
})
export class ContactComponent implements OnInit {
  user: UserModel = new UserModel();
  profileForm: FormGroup;
  githubApiService: GithubApiService = new GithubApiService(this.httpClient);
  username: string;
  userAvatarURL: string;

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private httpClient: HttpClient
  ) { }


  ngOnInit(): void {

  }
}