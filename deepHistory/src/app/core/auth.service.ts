import { Injectable } from "@angular/core";
import "rxjs/add/operator/toPromise";
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from "firebase/app";
//in place where you wanted to use `HttpClient`
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthService {
  constructor(public afAuth: AngularFireAuth, private http: HttpClient) {}

  // use the Firebase auth service to log in with Github
  doGithubLogin() {
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.GithubAuthProvider();
      this.afAuth.auth.signInWithPopup(provider).then(
        res => {
          
          let x = res.additionalUserInfo.profile.repos_url;
          this.http.get(x).subscribe(data => {
            console.log(data);
          });
          // $http({
          //   method: 'GET',
          //   url: x
          // }).then(
          //   function success(res) {
          //     console.log(res);
          //   }
          // );

          console.log(x);

          resolve(res);
        },
        err => {
          console.log(err);
          reject(err);
        }
      );
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
