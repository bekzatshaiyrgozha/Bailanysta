import { Component, OnInit } from '@angular/core';
import { NotificationService } from "../service/notification.service";
import { Notification } from "../models/Notification";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  notifications: Notification[] = [];
  isNotificationsOpen = false; // Track if the notifications panel is open

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.getNotifications().subscribe(data => {
      this.notifications = data;
      console.log(this.notifications);
    });
  }

  toggleNotifications() {
    this.isNotificationsOpen = !this.isNotificationsOpen; // Toggle notifications panel
  }

  acceptRequest(userId: number, index: number, notifId: number) {
    this.notificationService.deleteNotifications(notifId).subscribe(() => {
      this.notifications.splice(index, 1);
    });
  }
}
