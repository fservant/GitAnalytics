import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AngularFireAuth } from "angularfire2/auth";
import { UserService } from "../core/user.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    public afAuth: AngularFireAuth,
    public userService: UserService,
    private router: Router
  ) {}

  canActivate(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // try to navigate to the user page if the user exits
      this.userService.getCurrentUser().then(
        user => {
          this.router.navigate(["/user"]);
          return resolve(false);
        },
        err => {
          return resolve(true);
        }
      );
    });
  }
}
