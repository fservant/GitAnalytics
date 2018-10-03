import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from "@angular/core";

@Component({
  selector: 'something',
  templateUrl: 'repo.component.html'
})
export class RepoComponent implements OnInit {
  constructor(
    public route: ActivatedRoute,
    private httpClient: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log("Initializing page");
  }
}
