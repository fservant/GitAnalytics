import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { GithubApiService } from "../../core/services/github-api-service";
import { DataService } from "../../core/services/data-service";
import '../../../assets/css/styles.css';

@Component({
  selector: "page-project",
  templateUrl: "project.component.html",
  styleUrls: ["project.component.css"]
})
export class ProjectComponent implements OnInit {
  githubApiService: GithubApiService = new GithubApiService(this.httpClient);
  loginName: string;
  userAvatarURL: string;

  constructor(
    public route: ActivatedRoute,
    private httpClient: HttpClient,
    private router: Router,
    private dataService: DataService,
  ) {
    this.dataService.current.subscribe(name => (this.loginName = name));
  }

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