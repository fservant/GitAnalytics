import { Injectable } from "@angular/core";
import "rxjs/add/operator/toPromise";
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from "firebase/app";
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from "rxjs";

@Injectable()
export class AuthService {
  private source = new BehaviorSubject('default token');
  current = this.source.asObservable();

  constructor(public afAuth: AngularFireAuth, private http: HttpClient) {
  }

  // use the Firebase auth service to log in with Github
  doGithubLogin() {
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.GithubAuthProvider();
      this.afAuth.auth.signInWithPopup(provider).then(
        res => {
          console.log(res);
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

  changeToken(token: string) {
    this.source.next(token);
  }
}
