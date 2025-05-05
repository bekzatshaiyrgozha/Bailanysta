import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material-module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthInterceptorService} from './helper/auth-interceptor.service';
import {LoginComponent} from './auth/login/login.component';
import {RegisterComponent} from './auth/register/register.component';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {NavigationComponent} from './layout/navigation/navigation.component';
import {IndexComponent} from './layout/index/index.component';
import {ProfileComponent} from './user/profile/profile.component';
import {UserPostsComponent} from './user/user-posts/user-posts.component';
import {EditUserComponent} from './user/edit-user/edit-user.component';
import {AddPostComponent} from './user/add-post/add-post.component';
import {NotificationsComponent} from './notifications/notifications.component';
import {SearchComponent} from './search/search.component';
import {PublicUserComponent} from './user/public-user/public-user.component';
import {FriendsComponent} from "./user/friends/friends.component";
import { EditPostComponent } from './user/edit-post/edit-post.component';




@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    NavigationComponent,
    IndexComponent,
    ProfileComponent,
    UserPostsComponent,
    EditUserComponent,
    AddPostComponent,
    NotificationsComponent,
    SearchComponent,
    PublicUserComponent,
    FriendsComponent,
    EditPostComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MaterialModule,
        FormsModule,
        FormsModule,
        ReactiveFormsModule,
    ],

  
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true},
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

