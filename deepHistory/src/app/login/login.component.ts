import { Component } from "@angular/core";
import { AuthService } from "../core/auth.service";
import { Router, Params } from "@angular/router";
import { UserResolver } from "../user/user.resolver";

@Component({
  selector: "page-login",
  templateUrl: "login.component.html",
  styleUrls: ["login.scss"]
})
export class LoginComponent {
  constructor(public authService: AuthService, private router: Router) {}

  tryGithubLogin() {
    this.authService.doGithubLogin().then(res => {
      this.router.navigate(["/user"]);
    });
  }
}
