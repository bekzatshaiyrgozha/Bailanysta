import { Component } from '@angular/core';
import {UserService} from "../service/user.service";
import {SearchService} from "../service/search.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  users: any[] = [];
  searchInput!:string;
  constructor(private searchService: SearchService) {}

  onSearch(query: string) {
    if (query) {
      this.searchService.searchUsers(query).subscribe(data => {
        this.users = data;
        console.log(this.users);
        
      });
    }
  }
}

