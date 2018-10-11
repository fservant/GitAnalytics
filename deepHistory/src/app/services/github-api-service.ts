import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import "rxjs/add/operator/map";

@Injectable()
export class GithubApiService {
  shaId: any;
  constructor(private _http: HttpClient) {
    //empty constructor
  }

  public getRepositoryByOwnerAndRepo(
    owner: string,
    repo: string
  ): Observable<Object> {
    const url: string = this._generateRepositoryUrl(owner, repo);

    return this._http.get(url);
  }

  public getRepositoryCommits(owner: string, repo: string): Observable<Object> {
    const url: string = this._generateRepositoryCommitsUrl(owner, repo);

    return this._http.get(url);
  }

  public getUserRepositoryList(owner: string): Promise<string[]> {
    return this._getUserRepositoryList(owner, 1);
  }

  public getDirectoryStructureForRepo(repo: string, owner: string) {
    return new Promise((resolve, reject) => {
      let shaId: string;

      // fetch the shaId to get list of all files
      this.getMasterBranch(owner, repo)
        .forEach(datas => {
          shaId = datas["object"].sha;
        })
        .then(
          res => {
            const url = this._generateAllFilesUrl(owner, repo, shaId);
            resolve(this._http.get(url));
          },
          err => {
            console.log("Error getting files list for thhe repo", err);
            reject(err);
          }
        );
    });
    // gets ur the tree of the files in the repo
  }

  public getUserObjectWithId(id: string) {
    const url: string = this._generateUserObjectWithIdUrl(id);
    return this._http.get(url);
  }

  public getMasterBranch(owner: string, repo: string) {
    const masterBranch = this._generateRespositoryBranchUrl(
      owner,
      repo,
      "master"
    );
    return this._http.get(masterBranch);
  }

  public getAuthenticatedUserInfo(): Observable<Object> {
    const url: string = this._generateUserUrl();
    return this._http.get(url);
  }

  public getHtmlContentOfFiles(owner: string, repo: string, path: string) {
    return this._http
      .get(this._generateHtmlContentUrl(owner, repo, path), {
        headers: {
          "Content-Type": "application/json",
          'Accept' : "application/vnd.github.VERSION.object"
        },
        responseType: "text"
      })
      .toPromise();
    // construct the header to get the file with the whole html component;
  }

  private _getUserRepositoryList(
    owner: string,
    page_number: number
  ): Promise<string[]> {
    return new Promise((resolve, reject) => {
      let currentArray: any;
      const url: string = this._generateUserRepositoryUrl(owner, page_number);

      this._http
        .get<string[]>(url)
        .forEach(repo => {
          //repo here is a LIST of arrays
          currentArray = repo;
        })
        .then(
          //array is resolved in then
          res => {
            //If length is 100, there is a possibility of another page, hence concatenate the
            //current array with a recursive call (increase in page number)
            if (currentArray.length == 100) {
              this._getUserRepositoryList(owner, page_number + 1).then(res2 => {
                resolve(currentArray.concat(res2));
              });
            } else {
              //Gets here when we are at the last possible page of repos
              resolve(currentArray);
            }
          },
          err => {
            console.log("Error getting repo list", err);
            reject(err);
          }
        );
    });
  }

  private _generateUserRepositoryUrl(owner: string, page_number: number) {
    return `https://api.github.com/users/${owner}/repos?per_page=100\&page=${page_number}`;
  }

  private _generateUserObjectWithIdUrl(id: string) {
    return `https://api.github.com/user/${id}`;
  }

  private _generateRepositoryUrl(owner: string, repo: string) {
    return `https://api.github.com/repos/${owner}/${repo}`;
  }

  private _generateRepositoryCommitsUrl(owner: string, repo: string) {
    return `https://api.github.com/repos/${owner}/${repo}/commits`;
  }

  private _generateRespositoryBranchUrl(
    owner: string,
    repo: string,
    branch: string
  ) {
    return `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`;
  }

  private _generateAllFilesUrl(owner: string, repo: string, shaId: string) {
    return `https://api.github.com/repos/${owner}/${repo}/git/trees/${shaId}?recursive=1`;
  }

  private _generateUserUrl() {
    return `https://api.github.com/user`;
  }

  private _generateHtmlContentUrl(owner: string, repo: string, path: string) {
    return `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  }
}
