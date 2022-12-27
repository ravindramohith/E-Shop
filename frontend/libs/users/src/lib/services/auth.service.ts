import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalstorageService } from './localstorage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private localStorage: LocalstorageService, private router: Router) { }

  Login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${process.env["NX_API"]}/users/Login`, { email, password })
  }

  Logout() {
    this.localStorage.removeItem('jwtToken-Eshop');
    this.router.navigate(['/login']);
  }
}
