import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public mAuth: AuthService, private router: Router) { }

  tryGithubLogin() {
    this.mAuth.doGithubLogin()
  }
  ngOnInit() {
    
  }

}
