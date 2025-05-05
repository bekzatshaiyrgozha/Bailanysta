import {Component, OnInit} from '@angular/core';
import {Post} from '../../models/Post';
import {PostService} from '../../service/post.service';
import {CommentService} from '../../service/comment.service';
import {NotificationService} from '../../service/notification.service';
import {TokenStorageService} from "../../service/token-storage.service";
import {UserService} from "../../service/user.service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {EditUserComponent} from "../edit-user/edit-user.component";
import {AddPostComponent} from "../add-post/add-post.component";
import {EditPostComponent} from "../edit-post/edit-post.component";

@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.css']
})
export class UserPostsComponent implements OnInit {

  isUserPostsLoaded = false;
  posts!: Post [];


  constructor(private postService: PostService,
              private commentService: CommentService,
              private notificationService: NotificationService,
              private tokenStorage: TokenStorageService,
              private userService: UserService,
              private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    const username = this.tokenStorage.getUserName()
    this.userService.getPostsByUsername(username)
      .subscribe(data => {
        console.log(data);
        this.posts = data;
        this.isUserPostsLoaded = true;
      });
  }


  removePost(post: Post, index: number): void {
    console.log(post);
    const result = confirm('Do you really want to delete this post?');
    if (result) {
      this.postService.deletePost(post)
        .subscribe(() => {
          this.posts.splice(index, 1);
          this.notificationService.showSnackBar('Post deleted');
        });
    }
  }

  updatePost(post:Post){
    this.openEditDialog(post)
  }



  deleteComment(commentId: number | undefined, postIndex: number, commentIndex: number): void {
    const post = this.posts[postIndex];

    this.commentService.deleteComment(commentId)
      .subscribe(() => {
        this.notificationService.showSnackBar('Comment removed');
        post.comments.splice(commentIndex, 1);
      });
  }

  openEditDialog(post:Post){
    const dialogPostEditConfig = new MatDialogConfig();
    dialogPostEditConfig.width = '800px';
    dialogPostEditConfig.data = {
      post:post
    };
    this.dialog.open(EditPostComponent, dialogPostEditConfig);
  }

}
