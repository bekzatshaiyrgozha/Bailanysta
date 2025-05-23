import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private apiUrl = 'http://127.0.0.1:8000/api/posts/generate_ai_post/';

  constructor(private http: HttpClient) {}

  generatePost(prompt: string): Observable<{ generated_text: string }> {
    return this.http.post<{ generated_text: string }>(this.apiUrl, { prompt });
  }
}
