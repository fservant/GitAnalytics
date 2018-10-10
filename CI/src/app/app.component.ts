import { Component } from '@angular/core';
import { Router, NavigationStart } from "@angular/router";
import '../assets/css/styles.css';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent {
  title = 'CI';
  showNavbar: boolean;
  showHeader: boolean;

  constructor(private router: Router) {
    
    router.events.forEach((event) => {
        if(event instanceof NavigationStart) {
            this.showNavbar = (event.url !== "/login");
            this.showHeader = (event.url === "/login" || event.url === "/");
        }
      });
    }
}
