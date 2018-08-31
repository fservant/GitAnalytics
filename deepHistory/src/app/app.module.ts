import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
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

import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent, LoginComponent, UserComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot(rootRouterConfig, { useHash: false }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule // imports firebase/auth, only needed for auth features
  ],
  providers: [AuthService, UserService, UserResolver, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {}
