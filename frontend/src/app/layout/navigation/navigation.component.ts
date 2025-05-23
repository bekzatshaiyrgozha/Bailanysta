import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../service/token-storage.service';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../service/notification.service';
import { Notification } from '../../models/Notification';
import { SearchService } from '../../service/search.service';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  isLoggedIn: boolean = false;
  isDataLoaded: boolean = false;
  user: any;
  isDarkMode: boolean = false;
  menuOpen: boolean = false;
  isNotificationsOpen: boolean = false; // Track if notifications are open
  isSearchOpen: boolean = false; // Track if search panel is open
  notifications: Notification[] = [];
  searchInput: string = ''; // The search input value
  users: any[] = []; // Users for search results

  constructor(
    private tokenStorage: TokenStorageService,
    private userService: UserService,
    private router: Router,
    private notificationService: NotificationService,
    private searchService: SearchService // Inject the search service
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

    // Get notifications from service
    this.notificationService.getNotifications().subscribe(data => {
      this.notifications = data;
    });

    // On page load, check saved theme from localStorage
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark-theme') {
        document.body.classList.add('dark-theme');
        this.isDarkMode = true;
      }
    }
  }

  // Toggle the menu and also close the notifications and search panel when menu is toggled
  toggleMenu(): void {
    if (this.isLoggedIn) {
      this.menuOpen = !this.menuOpen;
      this.isNotificationsOpen = false; // Close notifications panel
      this.isSearchOpen = false; // Close search panel
    }
  }

  // Toggle notifications panel visibility
  toggleNotifications() {
    this.isNotificationsOpen = !this.isNotificationsOpen;
    this.isSearchOpen = false; // Close search panel when notifications are toggled
  }

  // Toggle search panel visibility
  toggleSearchPanel() {
    this.isSearchOpen = !this.isSearchOpen;
    this.isNotificationsOpen = false; // Close notifications panel when search panel is toggled
  }

  // Close both the menu and notifications panel
  closeAllPanels() {
    this.menuOpen = false;
    this.isNotificationsOpen = false;
    this.isSearchOpen = false; // Close search panel when navigating
  }

  // Handle logout
  logout() {
    this.tokenStorage.logOut();
    this.closeAllPanels(); // Close all panels when logging out
    this.router.navigate(['/login']);
  }

  // Toggle dark theme
  toggleTheme(): void {
    if (typeof window !== 'undefined') {
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

  onSearch(query: string) {
    if (query && query.trim() !== '') {
      this.searchService.searchUsers(query).subscribe(data => {
        this.users = data;
      });
    } else {
      this.clearSearch();
    }
  }
  

  // Clear search results
  clearSearch() {
    this.searchInput = ''; // Clear the input field
    this.users = []; // Clear the users array
  }
  

  // Accept notifications
  acceptRequest(userId: number, index: number, notifId: number) {
    this.notificationService.deleteNotifications(notifId).subscribe(() => {
      this.notifications.splice(index, 1);
    });
  }
  
}
