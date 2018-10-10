import { Injectable } from "@angular/core";
import "rxjs/add/operator/toPromise";
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from "firebase/app";
import { HttpClient } from '@angular/common/http';
import { GithubApiService } from "../services/github-api-service";

@Injectable()
export class AuthService {
  githubApiService: GithubApiService = new GithubApiService(this.http);

  constructor(public afAuth: AngularFireAuth, private http: HttpClient) {
  }

  // use the Firebase auth service to log in with Github
  doGithubLogin() {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          localStorage.setItem("currentUserId", user.providerData[0].uid);
          this.githubApiService
            .getUserObjectWithId(user.providerData[0].uid)
            .subscribe((userObject : any) => {
              this.githubApiService.getUserRepositoryList(userObject.login).then(res => {
                localStorage.setItem("currentUserRepos", JSON.stringify(res));
              })
              localStorage.setItem("username", userObject.login);
              resolve(userObject.login);
            });
        } else {
          let provider = new firebase.auth.GithubAuthProvider();
          this.afAuth.auth.signInWithPopup(provider).then(
            res => {
              resolve(res.additionalUserInfo.username);
            },
            err => {
              console.log(err);
              reject(err);
            }
          );
        }
      });
    });
  }

  doLogout() {
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        this.afAuth.auth.signOut();
        resolve();
      } else {
        reject();
      }
    });
  }
}
