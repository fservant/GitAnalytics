import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../core/authentication/auth.service";
import { Router } from "@angular/router";
import { DataService } from "../../core/services/data-service";
import '../../../assets/css/styles.css';

@Component({
  selector: "page-login",
  templateUrl: "login.component.html",
  styleUrls: ["login.component.css"]
})
export class LoginComponent implements OnInit {
  loginName: string;

  constructor(
    public authService: AuthService, 
    private router: Router, private data: DataService) {}

  tryGithubLogin() {
    this.authService.doGithubLogin().then(res => {
      this.data.changeValue(res);
      localStorage.setItem("username", res);
      this.router.navigate(["/home"]);
    });
  }

  ngOnInit() {
    this.data.current.subscribe(name => this.loginName = name);
  }
}