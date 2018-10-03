import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { RepoSharedService } from "../services/repo-shared-service";
import { GithubApiService } from "../services/github-api-service";
import { DataService } from "../services/shared-service";
import { Observable } from "rxjs";

@Component({
  selector: "page-repo",
  templateUrl: "repo.component.html",
  styleUrls: ["repo.component.css"]
})
export class RepoComponent implements OnInit {
  loginName: string;
  repoName: string;
  githubApiService: GithubApiService = new GithubApiService(this.httpClient);

  commits: any;
  files: any;

  constructor(
    public route: ActivatedRoute,
    private httpClient: HttpClient,
    private router: Router,
    private dataService: DataService,
    private repoService: RepoSharedService
  ) {
    this.repoService.current.subscribe(name => (this.repoName = name));
    this.dataService.current.subscribe(name => (this.loginName = name));
  }

  display(): void {
    this.githubApiService
      .getRepositoryCommits(this.loginName, this.repoName)
      .forEach((commit: any) => {
        this.commits = commit;
        console.log(this.commits);
      });
    this.githubApiService
      .getDirectoryStructureForRepo(this.repoName, this.loginName)
      .then((res: Observable<Object>) =>
        res.forEach(filesTree => {
          this.files = filesTree["tree"];
        })
      );
  }

  ngOnInit(): void {
    if (this.repoName !== "default name") {
      this.display();
    }
  }

  fileOnClick(file: string) {
    // TODO: pull the contents from the url.
    window.location.href = file["url"];
  }

  returnBack() {
    this.router.navigate(["/user"]);
  }
}
