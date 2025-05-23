import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Notification} from "../models/Notification";

const NOTIF_URL = 'http://127.0.0.1:8000/api/notifications/'

@Injectable({
  providedIn: 'root'
})
export class NotificationService {


  constructor(private snackbar: MatSnackBar, private http: HttpClient) {
  }

  public showSnackBar(message: string): void {
    this.snackbar.open(message, undefined, {
      duration: 2000
    });
  }

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(NOTIF_URL);
  }
  deleteNotifications(notifId:number): Observable<any>{
    return this.http.delete(`${NOTIF_URL}${notifId}/delete/`)
  }
}
