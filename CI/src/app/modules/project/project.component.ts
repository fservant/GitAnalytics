import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { GithubApiService } from "../../core/services/github-api-service";
import { DataService } from "../../core/services/data-service";
import * as firebase from "firebase";
import '../../../assets/css/styles.css';

declare function makePage(): any;

@Component({
  selector: "page-project",
  templateUrl: "project.component.html",
  styleUrls: ["project.component.css"]
})
export class ProjectComponent implements OnInit {
  githubApiService: GithubApiService = new GithubApiService(this.httpClient);
  username: string;
  userAvatarURL: string;

  constructor(
    public route: ActivatedRoute,
    private httpClient: HttpClient,
    private router: Router,
    private dataService: DataService,
  ) {
    this.dataService.username.subscribe(name => (this.username = name));
  }

  ngOnInit(): void {
    makePage();
  }
}