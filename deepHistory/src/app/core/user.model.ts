// Login in User Model. TODO: make a model for users Github Contents
export class UserModel {
  image: string;
  name: string;
  repos: any;
  username: string;

  constructor() {
    this.image = "";
    this.name = "";
    this.repos = new Array();
    this.username = "";
  }
}
