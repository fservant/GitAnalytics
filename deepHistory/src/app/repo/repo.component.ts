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

  commits: any;               //all commits on current repo
  files: any;                 //all files in current repo
  codes: any;                 //code of current file (chosen by file tab)
  commitFiles: any;           //list of files affected by current commit

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
    //gets all commits
    this.githubApiService
      .getRepositoryCommits(this.loginName, this.repoName)
      .forEach((commit: any) => {
        this.commits = commit;
      });

    //gets all files
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
    } else {
      this.router.navigate(["/user"]);
    }
  }

  fileOnClick(file: string): void {
    this.githubApiService
      .getHtmlContentOfFiles(this.loginName, this.repoName, file["path"])
      .then(res => {
        this.codes = atob(JSON.parse(res).content).split("\n");
      });
  }

  commitOnClick(sha: string): void {
    this.githubApiService
      .getSingleCommitWithSha(this.loginName, this.repoName, sha)
      .forEach(res => {
        this.commitFiles = res["files"];
      });
  }

  returnBack(): void {
    this.router.navigate(["/user"]);
  }

}
