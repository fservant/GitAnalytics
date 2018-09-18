import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GithubApiService {
    constructor(private _http: HttpClient) {
        //empty constructor
    }

    public getRepositoryByOwnerAndRepo(owner: string, repo: string): Observable<Object> {
        const url: string = this._generateRepositoryUrl(owner, repo);

        return this._http.get(url);
    }

    public getRepositoryCommits(owner: string, repo: string): Observable<Object> {
        const url: string = this._generateRepositoryCommitsUrl(owner, repo);

        return this._http.get(url);
    }

    public getUserRepositoryList(owner: string): Observable<Object> {
        const url: string = this._generateUserRepositoryUrl(owner);

        return this._http.get(url);
    }

    public getAuthenticatedUserInfo(): Observable<Object> {
        const url: string = `https://api.github.com/user`;

        return this._http.get(url);
    }

    private _generateRepositoryUrl(owner: string, repo: string) {
        return `https://api.github.com/repos/${owner}/${repo}`;
    }

    private _generateRepositoryCommitsUrl(owner: string, repo: string) {
        return `https://api.github.com/repos/${owner}/${repo}/commits`;
    }

    private _generateUserRepositoryUrl(owner: string) {
        return `https://api.github.com/users/${owner}/repos`;
    }
}