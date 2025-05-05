// username-resolver.service.ts
import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsernameResolver implements Resolve<boolean> {
  constructor(private userService: UserService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    const username = route.paramMap.get('username');
    return this.userService.isCurrentUser(username).pipe(
      tap(isCurrent => {
        if (isCurrent) {
          this.router.navigate(['/profile']);
        }
      })
    );
  }
}
