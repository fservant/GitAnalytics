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
  currentCommitIndex: number;
  currentCommitShaId: string;
  githubApiService: GithubApiService = new GithubApiService(this.httpClient);

  commits: any; //all commits on current repo
  files: any; //all files in current repo
  codes: any; //code of current file (chosen by file tab)
  commitFiles: any; //list of files affected by current commit

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
          this.files = filesTree["tree"].filter(obj => obj.type == "blob"); //filters directories out of view
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
        this.currentCommitShaId = res["sha"];
        this.commitFiles = res["files"];
      });

    this.currentCommitIndex = this.commits.findIndex(
      commit => commit["sha"] == sha
    );
  }

  fileToHistory(cf: any): void {
    this.router.navigate([
      "/history",
      this.currentCommitIndex,
      this.currentCommitShaId,
      cf["filename"]
    ]);
  }

  returnBack(): void {
    this.router.navigate(["/user"]);
  }

  // commitsbutton clears the containers on the right side and changes button color to white when clicked
  // filesbutton clears the containers on the right side and changes button color to white when clicked
  hideContainers() {
    if (document.getElementById("file_container") != null) {
      document.getElementById("file_container").style.display = "none";
    }
    if (document.getElementById("code_table") != null) {
      document.getElementById("code_table").style.display = "none";
    }
    if (document.getElementById("filebutton") != null) {
      document.getElementById("filebutton").style.backgroundColor = "#D0D0D0";
    }
    if (document.getElementById("commitbutton") != null) {
      document.getElementById("commitbutton").style.backgroundColor = "white";
    }
  }

  // file_container is the display of the files once a commit is clicked
  file_containerDisplay() {
    if (document.getElementById("file_container") != null) {
      document.getElementById("file_container").style.display = "initial";
    }
    if (document.getElementById("code_table") != null) {
      document.getElementById("code_table").style.display = "none";
    }
  }

  // table_container is the display of the code once a file is clicked
  table_containerDisplay() {
    if (document.getElementById("code_table") != null) {
      document.getElementById("code_table").style.display = "initial";
    }
    if (document.getElementById("file_container") != null) {
      document.getElementById("file_container").style.display = "none";
    }
  }
}
