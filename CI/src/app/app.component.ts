import { Component } from '@angular/core';
import { Router, NavigationStart } from "@angular/router";
import { DataService } from '../app/core/services/data-service';
import '../assets/css/styles.css';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent {
  title = 'Continuous Integration';
  showNavbar: boolean;
  showHeader: boolean;
  username: String;

  constructor(private router: Router, private data: DataService) {
    router.events.forEach((event) => {
        if(event instanceof NavigationStart) {
            this.showNavbar = (event.url !== "/login" && event.url !== "/");
            this.showHeader = (event.url === "/login" || event.url === "/" || event.url === "/home");
        }
      });
      data.username.subscribe(name => {this.username = name});
    }
}
