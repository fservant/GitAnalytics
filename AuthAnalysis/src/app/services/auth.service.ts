import { Injectable } from '@angular/core';
import { Router } from '@angular/router'
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthService {
  constructor(private _firebaseAuth: AngularFireAuth) {
    
  }

  doGithubLogin(){
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.GithubAuthProvider();
      this._firebaseAuth.auth
      .signInWithPopup(provider)
      .then(res => {
        resolve(res);
      }, err => {
        console.log(err);
        reject(err);
      })
    })
  }
}
