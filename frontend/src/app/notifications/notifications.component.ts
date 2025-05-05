import {Component, OnInit} from '@angular/core';
import {NotificationService} from "../service/notification.service";
import {Notification} from "../models/Notification";
import {FriendRequestService} from "../service/friend-request.service";
import {FriendStatus} from "../models/Friend";
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit{

  notifications: Notification[] = [];
  friendStatus!:FriendStatus;
  status!:FriendStatus;

  constructor(
    private notificationService: NotificationService,
    private friendService: FriendRequestService,
    private userService: UserService,
    ) {}

  ngOnInit() {
    this.notificationService.getNotifications().subscribe(data => {
      this.notifications = data;
      console.log(this.notifications)      
    });

  }
  acceptRequest(userId: number, index: number, notifId: number) {
    this.friendService.acceptSendFriendRequest(userId).subscribe({
      next: () => {
        console.log('Friend request accepted');
        this.notificationService.deleteNotifications(notifId).subscribe(()=>{
          this.notifications.splice(index, 1);
        })

      },
      error: (error) => console.error
    });
  }


}
