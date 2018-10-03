import { Routes } from "@angular/router";

import { LoginComponent } from "./login/login.component";
import { HomeComponent } from "./home/home.component";
import { UserComponent } from "./user/user.component";
import { UserResolver } from "./user/user.resolver";
import { AuthGuard } from "./core/auth.guard";
import { ProjectComponent } from "./project/project.component";
import { WikiComponent } from "./wiki/wiki.component";
import { ContactComponent } from "./contact/contact.component";

export const rootRouterConfig: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "login", component: LoginComponent, canActivate: [AuthGuard] },
  { path: "home", component: HomeComponent, resolve: { data: UserResolver }},
  { path: "user", component: UserComponent, resolve: { data: UserResolver }},
  { path: "project", component: ProjectComponent },
  { path: "wiki", component: WikiComponent },
  { path: "contact", component: ContactComponent },

];