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
  username: string;
  data: DataService;

  constructor(
    public authService: AuthService, private router: Router, dataService: DataService) {
      this.data = dataService;
    }

  tryGithubLogin() {
    this.authService.doGithubLogin().then(res => {
      this.data.changeUsername(res);
      localStorage.setItem("username", res);
      this.router.navigate(["/home"]);
    });
  }

  ngOnInit() {

  }
}