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
  githubApiService: GithubApiService = new GithubApiService(this.httpClient);

  commits: any;
  commitNumbers: any;

  displayFiles: string[][][];
  startEnd: StartEnd[];

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
            this.commitNumbers.push(index);
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
    this.displayFiles = new Array<Array<Array<string>>>();
    this.startEnd = new Array<StartEnd>();

    this.route.params.subscribe(params => {
      this.commitIndex = +params["commitNumber"];
      this.commitSha = params["sha"];
      this.fileName = params["filePath"];
    });

    this.commitNumbers = new Array<number>();
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
    
    let leftPatch  = new Array<Array<string>>();
    let rightPatch = new Array<Array<string>>();

    filePatches.forEach(element => {
      let patch = element.split("\n");
      // remove the github comment regarding the number of addition and deletions occured to the patch
      // there is a case where github adds text "No newline at end of file" which needs to be cleaned
      patch = patch[patch.length - 1].includes(" No newline at end of file")
        ? patch.slice(1, -1)
        : patch.slice(1);

      rightPatch.push(patch);

      //clean up each individual patch (left patch should not have deletions)
      let tmpArray = new Array<string>();
      patch.map(line => line.charAt(0) !== '-' ? tmpArray.push(line) : false);
      leftPatch.push(tmpArray);
    });

    this.setupLineNumbers(leftPatch, rightPatch);
  }

  //This is intended to add new lines to match up when comparing two diffs
  setupLineNumbers(leftPatch: Array<Array<string>>, rightPatch: Array<Array<string>>): void {
    //cleaned goes to j, regular goes to k
    //This is for the left side of the comparison
    for (let i = 0; i < rightPatch.length; i++) {
      let cleaned = new Array<string>();
      console.log(rightPatch[i]);
      for (let j = 0, k = 0; j < leftPatch[i].length; j++) {
        if (leftPatch[i][j].charAt(0) == '+' &&
            rightPatch[i][k].charAt(0) == '-') {
              
              let rightSideCounter = 0;
              while (leftPatch[i][j].charAt(0) == '+' &&
                    rightPatch[i][k].charAt(0) == '-') {
                cleaned.push(leftPatch[i][j]);
                k++;
                j++;
                rightSideCounter++;
              }
              j--;
              while (rightPatch[i][k].charAt(0) == '-') {
                cleaned.push('\n');
                k++;
              }
              k += rightSideCounter;
          } else if (rightPatch[i][k].charAt(0) == '-') {
              while (rightPatch[i][k].charAt(0) == '-') {
                cleaned.push('\n');
                k++;
              }
              j--;
          } else if (leftPatch[i][j].charAt(0) == '+') {
            rightPatch[i].splice(k+1, 0, '\n');
            cleaned.push(leftPatch[i][j]);
            k += 2;
          } else {
            cleaned.push(leftPatch[i][j]);
            k++;
          }
      }
      leftPatch[i] = cleaned;
    }

    //This is for the right side of the comparison
    rightPatch = rightPatch.map(file => 
      file.map(line => 
        line.charAt(0) == '+' ? '' : line)
        .filter(line => 
          line !== ''));
  
    //This puts everything into one array
    let tmp = new Array<Array<string>>();
    for (let i = 0; i < rightPatch.length; i++) {
      tmp.push(leftPatch[i]);
      tmp.push(rightPatch[i]);
    }

    this.displayFiles.push(tmp);
    this.startEnd.push(new StartEnd());

    //TODO: The duplicacy is for proof of concept - remove if needed
    // this.displayFiles.push(tmp);
    // this.startEnd.push(new StartEnd());
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

  startClick(index: number) {
    if (this.startEnd[index].start >= 2) {
      this.startEnd[index].start -= 2;
      this.startEnd[index].end -= 2;
    }
  }

  endClick(index: number, file: Array<Array<string>>) {
    if (this.startEnd[index].end < file.length) {
      this.startEnd[index].start += 2;
      this.startEnd[index].end += 2;
    }
  }

  ngOnInit(): void {
    if (this.repoName !== "default name") {
      this.setup();
    } else {
      this.router.navigate(["/user"]);
    }
  }

  returnBack(): void {
    this.router.navigate(["/repo"]);
  }
}

class StartEnd {
  start: number;
  end: number;

  constructor() {
    this.start = 0;
    this.end = 2;
  }
}
