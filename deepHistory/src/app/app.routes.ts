import { Routes } from "@angular/router";

import { LoginComponent } from "./login/login.component";
import { UserComponent } from "./user/user.component";
import { UserResolver } from "./user/user.resolver";
import { AuthGuard } from "./core/auth.guard";
import { RepoComponent } from "./repo/repo.component";
import { HistoryComponent } from "./history/history.component";

export const rootRouterConfig: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "login", component: LoginComponent, canActivate: [AuthGuard] },
  { path: "user", component: UserComponent, resolve: { data: UserResolver }},
  { path: "repo", component: RepoComponent },
  { path: "history/:commitNumber/:sha/:filePath", component: HistoryComponent }
];
