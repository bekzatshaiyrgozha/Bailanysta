import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {User} from "../models/User";
import {Friend, FriendStatus} from "../models/Friend";
import {TokenStorageService} from "./token-storage.service";

const USER_API = 'http://127.0.0.1:8000/api/users/';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private tokenService: TokenStorageService) { }


  getUserProfile(userId: string|null): Observable<any> {
    return this.http.get(`${USER_API}${userId}/`);
  }
  getUserProfileByUsername(username: string|null): Observable<any> {
    return this.http.get(`${USER_API}${username}/`);
  }

  updateUserImageProfile(user: User, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('profile_pic', file, file.name);
    return this.http.put(`${USER_API}${user.id}/`, formData);
  }

  isCurrentUser(username: string|null): Observable<boolean> {
    return of(this.tokenService.getUserName() === username);
  }


  updateUser(user: any): Observable<any> {
    const userData = {
      first_name: user.first_name,
      last_name: user.last_name,
      bio: user.bio,
    };
    return this.http.put(`${USER_API}${user.id}/`, userData);
  }


  getPostsByUsername(username:string): Observable<any> {
    return this.http.get(`${USER_API}${username}/posts/`);
  }

  getFriendRequestStatus(username:string): Observable<FriendStatus> {
    return this.http.get<FriendStatus>(`${USER_API}${username}/friendship-status/`)
  }
  updateFriendRequestStatus(username:string, accepted:boolean){
    const data = { username: username, accepted: accepted };
    return this.http.post<FriendStatus>(`${USER_API}${username}/friendship-status/`, data);
  }

}
