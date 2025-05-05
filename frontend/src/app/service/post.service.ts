import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Post} from '../models/Post';
import {Observable} from 'rxjs';

const POST_API = 'http://127.0.0.1:8000/api/posts';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  getPosts(currentPage: number) {
    throw new Error('Method not implemented.');
  }

  constructor(private http: HttpClient) {
  }

  createPost(body: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('body', body);
    formData.append('image', file, file.name);
    return this.http.post(`${POST_API}/add/`, formData);
  }

  getAllPosts(page: number): Observable<any> {
    return this.http.get<Post[]>(`${POST_API}?page=${page}`);
  }

  deletePost(post: Post): Observable<any> {
    return this.http.delete(`http://127.0.0.1:8000/api/posts/${post.id}`, post);
  }

  likePost(post: Post): Observable<any> {
    return this.http.post(`http://127.0.0.1:8000/api/posts/${post.id}/like/`, post);
  }

  addToCommentToPost(post: Post, message: string): Observable<any> {
    return this.http.post(`http://127.0.0.1:8000/api/posts/${post.id}/comments/`, {
      post: post.id,
      body: message
    });
  }

  getCommentsToPost(postId: number | undefined): Observable<any> {
    return this.http.get(`http://127.0.0.1:8000/api/posts/${postId}/comments/`);
  }
  updatePost(post:Post, file:File, postId:number): Observable<any>{
    const formData = new FormData();
    formData.append('body', post.body);
    formData.append('image', file, file.name);
    return this.http.put(`http://127.0.0.1:8000/api/posts/${postId}`, formData);
  }
}
