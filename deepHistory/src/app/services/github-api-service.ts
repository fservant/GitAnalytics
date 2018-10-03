import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import { map } from "rxjs/operators";

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
    // assuming we get the master branch
    this.shaId = this.getMasterBranch(owner, repo);
    console.log(this.shaId);
    const url = `https://api.github.com/repos/${owner}/${repo}/git/trees/${
      this.shaId
    }?recursive=1`;

    return this._http.get(url); // gets ur the tree of the files in the repo
  }

  public getUserObjectWithId(id: string) {
    const url: string = this._generateUserObjectWithIdUrl(id);
    return this._http.get(url);
  }

  public getMasterBranch(owner: string, repo: string) {
    const masterBranch = `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/master`;
    return this._http
      .get(masterBranch)
      .pipe(map(response => response["objects"].sha));
  }
  public getAuthenticatedUserInfo(): Observable<Object> {
    const url: string = `https://api.github.com/user`;

    return this._http.get(url);
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
          currentArray = repo;
        })
        .then(
          res => {
            if (currentArray.length == 100) {
              this._getUserRepositoryList(owner, page_number + 1).then(res2 => {
                resolve(currentArray.concat(res2));
              });
            } else {
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
}
