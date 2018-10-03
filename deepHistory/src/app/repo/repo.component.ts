import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from "@angular/core";
import { RepoSharedService } from '../services/repo-shared-service';
import { GithubApiService } from '../services/github-api-service';
import { DataService } from '../services/shared-service';

@Component({
  selector: 'page-repo',
  templateUrl: 'repo.component.html'
})
export class RepoComponent implements OnInit {
  loginName: string;
  repoName: string;
  githubApiService: GithubApiService = new GithubApiService(this.httpClient);

  commits: any;

  constructor(
    public route: ActivatedRoute,
    private httpClient: HttpClient,
    private router: Router,
    private dataService: DataService,
    private repoService: RepoSharedService
  ) { 
    this.repoService.current.subscribe(name => this.repoName = name); 
    this.dataService.current.subscribe(name => this.loginName = name);
  }

  display(): void {
    this.githubApiService.getRepositoryCommits(this.loginName, this.repoName)
      .forEach( (commit : any) => {
        this.commits = commit;
      });
  }

  ngOnInit(): void {
    if (this.repoName !== "default name") {
      this.display();
    }
  }
}
