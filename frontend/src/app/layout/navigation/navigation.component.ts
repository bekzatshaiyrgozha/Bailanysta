import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../service/token-storage.service';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  
  isLoggedIn: boolean = false;
  isDataLoaded: boolean = false;
  user: any;  // User type should be defined based on your data model
  isDarkMode: boolean = false;   

  constructor(
    private tokenStorage: TokenStorageService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoggedIn = !!this.tokenStorage.getUserId();
    if (this.isLoggedIn) {
      this.userService.getUserProfile(this.tokenStorage.getUserId())
        .subscribe(data => {
          this.user = data;
          this.isDataLoaded = true;
        });
    }

    // On page load, check saved theme from localStorage
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark-theme') {
        document.body.classList.add('dark-theme');
        this.isDarkMode = true;
      }
    }
  }

  logout() {
    this.tokenStorage.logOut();
    this.router.navigate(['/login']);
  }

  toggleTheme(): void {
    if (typeof window !== 'undefined') {
      if (document.body.classList.contains('dark-theme')) {
        console.log("Dark theme is enabled");
      } else {
        console.log("Dark theme is disabled");
      }
  
      // Тақырыпты ауыстыру
      if (document.body.classList.contains('dark-theme')) {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', '');
        this.isDarkMode = false;
      } else {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark-theme');
        this.isDarkMode = true;
      }
    }
  }
  
}
