import {Component, Inject, OnInit} from '@angular/core';
import {Friend} from "../../models/Friend";
import {UserService} from "../../service/user.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {User} from "../../models/User";

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.css'
})
export class FriendsComponent implements OnInit{
  friends!: Friend[];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    private dialogRef: MatDialogRef<FriendsComponent>,
    ) {}

  ngOnInit(){
    this.friends = this.data.user.friends;
    console.log(this.friends)
  }
  closeModal(){
    this.dialogRef.close();
  }

}
