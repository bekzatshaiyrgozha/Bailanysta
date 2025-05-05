import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

const SEARCH_API = 'http://127.0.0.1:8000/api/search/'

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) {
  }

  searchUsers(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${SEARCH_API}?q=${query}`);

  }
}
