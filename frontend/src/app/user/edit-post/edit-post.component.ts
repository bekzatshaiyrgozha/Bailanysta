import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../models/User";
import {PostService} from "../../service/post.service";
import {NotificationService} from "../../service/notification.service";
import {Post} from "../../models/Post";
import {Router} from "@angular/router";

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.css'
})
export class EditPostComponent implements OnInit{

  public postEditForm!: FormGroup;
  selectedFile!:File;
  previewImgURL: any;



  constructor(
    private dialogRef: MatDialogRef<EditPostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private postService: PostService,
    private notificationService: NotificationService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.postEditForm = this.createPostForm();
  }

  createPostForm(): FormGroup {
    return this.fb.group({
      body: [
        this.data.post.body,
        Validators.compose([Validators.required])
      ],
    });
  }

  submit() {
    this.postService.updatePost(this.updatePost(), this.selectedFile, this.data.post.id)
      .subscribe(() => {
        window.location.reload();
        this.dialogRef.close();
        this.notificationService.showSnackBar('Post updated succesfully');
      })
  }

  private updatePost(): Post {
    this.data.post.body = this.postEditForm.value.body;
    return this.data.post;
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = (e) => {
      this.previewImgURL = reader.result;
    };
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
