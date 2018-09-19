import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { AngularFireModule } from "angularfire2";
import { AngularFireAuthModule } from "angularfire2/auth";
import { AngularFirestoreModule } from "angularfire2/firestore";
import { environment } from "../environments/environment";
import { rootRouterConfig } from "./app.routes";
import { AuthGuard } from "./core/auth.guard";
import { AuthService } from "./core/auth.service";
import { UserService } from "./core/user.service";
import { LoginComponent } from "./login/login.component";
import { UserComponent } from "./user/user.component";
import { UserResolver } from "./user/user.resolver";
import {HttpClientModule} from '@angular/common/http';

import { AppComponent } from "./app.component";
import { DataService } from "./services/shared-service";

import { MatCardModule } from '@angular/material';
import { RepositorySearchPipe } from "./pipe/repository-search-pipe";

@NgModule({
  declarations: [AppComponent, LoginComponent, UserComponent, RepositorySearchPipe],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot(rootRouterConfig, { useHash: false }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    HttpClientModule,
    MatCardModule,
    FormsModule
  ],
  providers: [AuthService, UserService, UserResolver, AuthGuard, DataService],
  bootstrap: [AppComponent]
})
export class AppModule {}
