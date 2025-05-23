import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import {IndexComponent} from './layout/index/index.component';
import {AuthGuardService} from './helper/auth-guard.service';
import {ProfileComponent} from './user/profile/profile.component';
import {UserPostsComponent} from './user/user-posts/user-posts.component';
import {AddPostComponent} from './user/add-post/add-post.component';
import {NotificationsComponent} from "./notifications/notifications.component";
import {SearchComponent} from "./search/search.component";
import {PublicUserComponent} from "./user/public-user/public-user.component";
import {UsernameResolver} from "./service/username-resolver.service";


const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'main', component: IndexComponent, canActivate: [AuthGuardService]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService], children: [
    {path: '', component: UserPostsComponent, canActivate: [AuthGuardService]},
    {path: 'add', component: AddPostComponent, canActivate: [AuthGuardService]},
  ]},
  {path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuardService]},
  {path: 'search', component: SearchComponent, canActivate: [AuthGuardService]},
  { path: 'users/:username', component: PublicUserComponent, resolve: { isCurrentUser: UsernameResolver }, canActivate: [AuthGuardService] },

  {path: '', redirectTo: 'main', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
