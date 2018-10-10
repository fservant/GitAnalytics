import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { AngularFireModule } from "angularfire2";
import { AngularFireAuthModule } from "angularfire2/auth";
import { AngularFirestoreModule } from "angularfire2/firestore";
import { environment } from "../environments/environment";
import { rootRouterConfig } from "./app.routes";
import { AuthGuard } from "./core/guards/auth.guard";
import { AuthService } from "./core/authentication/auth.service";
import { UserService } from "./core/http/user/user.service";
import { LoginComponent } from "./modules/login/login.component";
import { UserComponent } from "./modules/user/user.component";
import { UserResolver } from "./modules/user/user.resolver";
import { HomeComponent } from "./modules/home/home.component";
import { ProjectComponent } from "./modules/project/project.component";
import { WikiComponent } from "./modules/wiki/wiki.component";
import { ContactComponent } from "./modules/contact/contact.component";
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from "./app.component";
import { DataService } from "./core/services/data-service";
import { FooterComponent } from "./shared/layout/footer/footer.component";
import { RepositorySearchPipe } from "./shared/pipes/repository-search-pipe";
import { NavbarComponent } from "./shared/layout/navbar/navbar.component";
import { HeaderComponent } from "./shared/layout/header/header.component";

@NgModule({
  declarations: [
    AppComponent, 
    LoginComponent, 
    UserComponent, 
    RepositorySearchPipe, 
    HomeComponent, 
    ProjectComponent,
    WikiComponent, 
    ContactComponent,
    FooterComponent,
    NavbarComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(rootRouterConfig, { useHash: false }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    HttpClientModule,
  ],
  providers: [AuthService, UserService, UserResolver, AuthGuard, DataService],
  bootstrap: [AppComponent]
})
export class AppModule {}