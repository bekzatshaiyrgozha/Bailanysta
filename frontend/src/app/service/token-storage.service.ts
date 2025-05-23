import {Injectable} from '@angular/core';

const TOKEN_KEY = 'userToken';
const USER_KEY = 'userData';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() {
  }

  public saveToken(token: string): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken() {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(TOKEN_KEY);
    }
    return undefined;
  }


  public saveUser(user:any): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(USER_KEY);
    }
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  public getUserName(){
    if (typeof window !== 'undefined' && window.localStorage) {
      const userDataString = localStorage.getItem('userData');
      let userUsername
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        userUsername = userData.username;
      }
      return userUsername;
    }
  }

  public getCurrentUser(){
    if (typeof window !== 'undefined' && window.localStorage) {
      const currentUser = localStorage.getItem(USER_KEY);
      if(currentUser){
        return JSON.parse(currentUser);
      }
    }
    return undefined;
  }

  public getUserId(){
    if (typeof window !== 'undefined' && window.localStorage) {
      const userDataString = localStorage.getItem('userData');
      let userId
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        userId = userData.id;
      }

      return userId;
    }

  }

  logOut(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
      window.location.reload();
    }

  }
}
