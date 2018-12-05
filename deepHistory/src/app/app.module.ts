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
import { HistoryComponent } from "./history/history.component";
import { RepoComponent } from "./repo/repo.component";
import { UserComponent } from "./user/user.component";
import { UserResolver } from "./user/user.resolver";
import { HttpClientModule } from '@angular/common/http';
import { MatGridListModule } from '@angular/material/grid-list';
import { AppComponent } from "./app.component";
import { DataService } from "./services/shared-service";
import { MatCardModule } from '@angular/material';
import { RepositorySearchPipe } from "./pipe/repository-search-pipe";
import { CommitSearchPipe } from "./pipe/commit-search-pipe";
import { FileSearchPipe } from "./pipe/file-search-pipe";
import { RepoSharedService } from './services/repo-shared-service';
import { LineSearchPipe } from "./pipe/line-search-pipe";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [AppComponent, LoginComponent, HistoryComponent, RepoComponent, UserComponent, RepositorySearchPipe,
    CommitSearchPipe, FileSearchPipe, LineSearchPipe],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot(rootRouterConfig, { useHash: false }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    HttpClientModule,
    MatCardModule,
    FormsModule,
    MatGridListModule,
    NgbModule
  ],
  providers: [AuthService, UserService, UserResolver, AuthGuard, DataService, RepoSharedService],
  bootstrap: [AppComponent]
})
export class AppModule {}
