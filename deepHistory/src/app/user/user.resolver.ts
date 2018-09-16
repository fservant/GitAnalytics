import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, Router } from "@angular/router";
import { UserService } from "../core/user.service";
import { FirebaseUserModel } from "../core/user.model";

@Injectable()
export class UserResolver implements Resolve<FirebaseUserModel> {
  constructor(public userService: UserService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot): Promise<FirebaseUserModel> {
    let user = new FirebaseUserModel();
    // Fill the user model.
    return new Promise((resolve, reject) => {
      this.userService.getCurrentUser().then(
        res => {
          user.image = res.photoURL;
          user.name = res.displayName;
          console.log(res);
          return resolve(user);
        },
        err => {
          this.router.navigate(["/login"]);
          return reject(err);
        }
      );
    });
  }
}
