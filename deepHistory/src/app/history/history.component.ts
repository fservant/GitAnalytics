import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { GithubApiService } from "../services/github-api-service";
import { DataService } from "../services/shared-service";
import { RepoSharedService } from "../services/repo-shared-service";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "page-history",
  templateUrl: "history.component.html",
  styleUrls: ["history.component.css"]
})
export class HistoryComponent implements OnInit {
  loginName: string;
  repoName: string;
  commitIndex: number;
  commitSha: string;
  fileName: string;
  patches: string[][];

  githubApiService: GithubApiService = new GithubApiService(this.httpClient);

  commits: any;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private repoService: RepoSharedService
  ) {
    this.repoService.current.subscribe(name => (this.repoName = name));
    this.dataService.current.subscribe(name => (this.loginName = name));
  }

  getDiffs(index: number, array: string[]): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.githubApiService
        .getSingleCommitWithSha(
          this.loginName,
          this.repoName,
          this.commits[index]["sha"]
        )
        .forEach(res => {
          let tmpIndex = res["files"].findIndex(
            file => file["filename"] == this.fileName
          );
          if (tmpIndex !== -1) {
            array.push(res["files"][tmpIndex]["patch"]);
          }
        })
        .then(
          res => {
            if (index + 1 >= this.commits.length) {
              resolve(array);
            } else {
              this.getDiffs(index + 1, array).then(res2 => {
                resolve(res2);
              });
            }
          },
          err => {
            console.log("Error when getting diffs", err);
            reject(err);
          }
        );
    });
  }

  setup(): void {
    this.patches = new Array<Array<string>>();

    this.route.params.subscribe(params => {
      this.commitIndex = +params["commitNumber"];
      this.commitSha = params["sha"];
      this.fileName = params["filePath"];
    });

    //gets all commits
    this.githubApiService
      .getRepositoryCommits(this.loginName, this.repoName)
      .forEach((commit: any) => {
        this.commits = commit;
      })
      .then(res => {
        this.getDiffs(this.commitIndex, new Array<string>()).then(res => {
          this.splitFilesPatches(res);
        });
      });
  }

  splitFilesPatches(filePatches: string[]) {
    filePatches.forEach(element => {
      let patch = element.split("\n").map(item => item.trim());
      // remove the github comment regarding the number of addition and deletions occured to the patch
      // there is a case where github adds text "No newline at end of file" which needs to be cleaned
      patch = patch[patch.length - 1].includes(" No newline at end of file")
        ? patch.slice(1, -1)
        : patch.slice(1);

      this.patches.push(patch);
    });
  }

  // update the background color patch
  backgroundColorForPatch(code: string) {
    let char = code.charAt(0);
    if (char == "+") {
      return "add";
    } else if (char == "-") {
      return "deletion";
    }
    return "";
  }

  ngOnInit(): void {
    if (this.repoName !== "default name") {
      this.setup();
    } else {
      this.router.navigate(["/user"]);
    }
  }
}
