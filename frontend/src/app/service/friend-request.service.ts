import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

const FriendRequest_URL = 'http://127.0.0.1:8000/api/friend-requests/';

@Injectable({
  providedIn: 'root'
})
export class FriendRequestService {

  constructor(private http: HttpClient) {
  }

  sendFriendRequest(toUserId: number): Observable<any> {
    return this.http.post(`${FriendRequest_URL}send/`, {to_user_id: toUserId});
  }

  acceptSendFriendRequest(userId: number): Observable<any> {
    return this.http.post(`${FriendRequest_URL}accept/`, {userId})
  }

}
