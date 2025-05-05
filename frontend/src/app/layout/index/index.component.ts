import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Post } from '../../models/Post';
import { User } from '../../models/User';
import { PostService } from '../../service/post.service';
import { UserService } from '../../service/user.service';
import { NotificationService } from '../../service/notification.service';
import { TokenStorageService } from "../../service/token-storage.service";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  filteredPosts: Post[] = [];
  isUserDataLoaded = false;
  skeletonArray = Array(3);
  user!: User;
  message!: string;

  searchQuery: string = '';

  currentPage = 1;
  isLoading = false;
  observer!: IntersectionObserver;

  @ViewChild('marker') marker!: ElementRef;

  constructor(
    private postService: PostService,
    private userService: UserService,
    private notificationService: NotificationService,
    private tokenService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !this.isLoading) {
        this.loadPosts();
      }
    }, { rootMargin: '100px' });

    this.loadPosts();

    const userId = this.tokenService.getUserId();
    this.userService.getUserProfile(userId).subscribe(data => {
      this.user = data;
      this.isUserDataLoaded = true;
    });
  }

  ngAfterViewInit() {
    if (this.marker) {
      this.observer.observe(this.marker.nativeElement);
    }
  }

  ngOnDestroy() {
    this.observer.disconnect();
  }

  loadPosts() {
    this.isLoading = true;
    this.postService.getAllPosts(this.currentPage).subscribe(data => {
      this.posts = this.posts.concat(data.results);
      this.filteredPosts = this.posts; 
      this.getCommentsToPosts(this.posts);
      this.isLoading = false;
      if (data.next) {
        this.currentPage++;
      } else {
        this.observer.disconnect();
      }
    });
  }

  getCommentsToPosts(posts: Post[]): void {
    posts.forEach(p => {
      this.postService.getCommentsToPost(p.id).subscribe(data => {
        p.comments = data;
      });
    });
  }

  likePost(postIndex: number): void {
    const post = this.filteredPosts[postIndex];
    if (!post.userLiked.includes(this.user.username)) {
      this.postService.likePost(post).subscribe(() => {
        post.userLiked.push(this.user.username);
        this.notificationService.showSnackBar('Liked!');
      });
    } else {
      this.postService.likePost(post).subscribe(() => {
        const index = post.userLiked.indexOf(this.user.username);
        if (index > -1) {
          post.userLiked.splice(index, 1);
        }
      });
    }
  }

  postComment(message: string, postIndex: number): void {
    if (!message.trim()) return;
    const post = this.filteredPosts[postIndex];
    this.postService.addToCommentToPost(post, message).subscribe(data => {
      post.comments.push(data);
      this.message = '';
    });
  }

  onSearchChange(): void {
    const query = this.searchQuery.toLowerCase().trim();
    if (query) {
      this.filteredPosts = this.posts.filter(post =>
        post.body.toLowerCase().includes(query) ||
        post.user.toLowerCase().includes(query)
      );
    } else {
      this.filteredPosts = this.posts;
    }
  }
}
