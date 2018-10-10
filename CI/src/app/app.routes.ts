import { Routes } from "@angular/router";

import { LoginComponent } from "./modules/login/login.component";
import { HomeComponent } from "./modules/home/home.component";
import { UserComponent } from "./modules/user/user.component";
import { UserResolver } from "./modules/user/user.resolver";
import { AuthGuard } from "./core/guards/auth.guard";
import { ProjectComponent } from "./modules/project/project.component";
import { WikiComponent } from "./modules/wiki/wiki.component";
import { ContactComponent } from "./modules/contact/contact.component";

export const rootRouterConfig: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "login", component: LoginComponent, canActivate: [AuthGuard] },
  { path: "home", component: HomeComponent, resolve: { data: UserResolver }},
  { path: "user", component: UserComponent, resolve: { data: UserResolver }},
  { path: "project", component: ProjectComponent, resolve: { data: UserResolver }},
  { path: "wiki", component: WikiComponent },
  { path: "contact", component: ContactComponent },
];