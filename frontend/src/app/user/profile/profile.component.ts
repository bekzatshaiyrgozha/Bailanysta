import {Component, OnInit} from '@angular/core';
import {User} from '../../models/User';
import {TokenStorageService} from '../../service/token-storage.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {NotificationService} from '../../service/notification.service';
import {UserService} from '../../service/user.service';
import {EditUserComponent} from '../edit-user/edit-user.component';
import {FriendsComponent} from "../friends/friends.component";
import {Friend} from "../../models/Friend";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user!: User;
  selectedFile!: File;
  previewImgURL: any;
  isUserDataLoaded = false;
  friends!: Friend[];

  constructor(
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private userService: UserService,
    private tokenStorage: TokenStorageService,
  ) {
  }

  ngOnInit() {
    const userId = this.tokenStorage.getUserId();
    this.userService.getUserProfile(userId)
      .subscribe(data => {
        this.user = data;
        console.log(this.user)
        this.isUserDataLoaded = true;
      });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = () => {
      this.previewImgURL = reader.result;
    }
  }

  openEditDialog() {
    const dialogUserEditConfig = new MatDialogConfig();
    dialogUserEditConfig.width = '800px';
    dialogUserEditConfig.data = {
      user: this.user
    };
    this.dialog.open(EditUserComponent, dialogUserEditConfig);
  }

  openFriendDialog() {
    const dialogFriendConfig = new MatDialogConfig();
    dialogFriendConfig.width = '800px';
    dialogFriendConfig.data = {
      user: this.user
    };
    this.dialog.open(FriendsComponent, dialogFriendConfig);
  }


  onUpload() {
    if (this.selectedFile != null) {
      this.userService.updateUserImageProfile(this.user, this.selectedFile)
        .subscribe({
          next: (response) => {
            this.notificationService.showSnackBar('Profile image updated successfully');
            // @ts-ignore
            this.selectedFile = null;
          },
          error: (error) => {
            console.error('Error updating profile:', error);
            this.notificationService.showSnackBar('Failed to update profile image');
          }
        })
    }
  }
}