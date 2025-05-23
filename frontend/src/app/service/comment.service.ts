import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

const COMMENT_API = 'http://127.0.0.1:8000/api/comments/';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) {
  }

  deleteComment(commentId: number | undefined): Observable<any> {
    return this.http.delete(`${COMMENT_API}${commentId}`);
  }

}
