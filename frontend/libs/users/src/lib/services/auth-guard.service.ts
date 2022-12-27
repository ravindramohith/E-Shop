import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalstorageService } from './localstorage.service';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, private localStorage: LocalstorageService, private messageService: MessageService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const token = this.localStorage.getItem('jwtToken-Eshop')
    if (token) {
      const tokenDecode = JSON.parse(atob(token.split('.')[1]))
      if (tokenDecode.isAdmin && !this._tokenExpired(tokenDecode.exp)) {
        return true;
      }
      if (!tokenDecode.isAdmin) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Only Admins are allowed to access this Portal!" })
      }
    }
    this.router.navigate(['/login'])
    return false;
  }

  private _tokenExpired(expiration: any): boolean {
    return Math.floor(new Date().getTime() / 1000) >= expiration;
  }
}
