import { Component, OnInit } from "@angular/core";
import { AuthService } from "../core/auth.service";
import { Router } from "@angular/router";
import { DataService } from "../services/shared-service";

@Component({
  selector: "page-login",
  templateUrl: "login.component.html",
  styleUrls: ["login.scss"]
})
export class LoginComponent implements OnInit {
  loginName: string;

  constructor(public authService: AuthService, private router: Router, private data: DataService) {}

  tryGithubLogin() {
    this.authService.doGithubLogin().then(res => {
      this.data.changeValue(res);
      this.router.navigate(["/user"]);
    });
  }

  ngOnInit() {
    this.data.current.subscribe(name => this.loginName = name);
  }
}
