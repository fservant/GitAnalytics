// Login in User Model. TODO: make a model for users Github Contents
export class FirebaseUserModel {
  image: string;
  name: string;
  repos: string[];
  username: string;

  constructor() {
    this.image = "";
    this.name = "";
    this.repos = new Array();
    this.username = "";
  }
}
