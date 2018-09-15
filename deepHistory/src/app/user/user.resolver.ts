import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, Router } from "@angular/router";
import { UserService } from "../core/user.service";
import { FirebaseUserModel } from "../core/user.model";
import { GithubApiService } from "../github-api/github-api-service";
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserResolver implements Resolve<FirebaseUserModel> {
  constructor(public userService: UserService, private http: HttpClient, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot): Promise<FirebaseUserModel> {
    let user = new FirebaseUserModel();

    // Fill the user model.
    return new Promise((resolve, reject) => {
      this.userService.getCurrentUser().then(
        res => {
          user.image = res.photoURL;
          user.name = res.displayName;

          /*****************************************************
           * TESTING AREA FOR GETTING LIST OF REPOS
           * TODO: Right now username is hard coded, needs to be passed from auth.service.ts
           *****************************************************/
          let x = new GithubApiService(this.http);
          let d = x.getUserRepositoryList("rising2top");
          d.subscribe(
            data => {
              console.log(data);
            }
          )
           /****************************************************/
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
