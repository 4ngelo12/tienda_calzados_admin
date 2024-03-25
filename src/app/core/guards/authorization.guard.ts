import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService, LocalstorageService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuard implements CanActivate {

  constructor(private authService: AuthService, private lsService: LocalstorageService, private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const admin: boolean = this.authService.validateAdmin();

    if (!this.lsService.validateToken()) {
      this.router.navigate(['/auth/login'])
    }

    if (!admin) {
      return this.router.parseUrl('/unauthorized');
    }
    return true;
  }

}
