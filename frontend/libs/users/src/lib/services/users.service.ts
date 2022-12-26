import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as countriesLib from 'i18n-iso-countries';
declare const require: (arg0: string) => countriesLib.LocaleData;

@Injectable({
    providedIn: 'root'
})

export class UsersService {
    constructor(private http: HttpClient) {
        countriesLib.registerLocale(require('i18n-iso-countries/langs/en.json'));
    }

    getUsers(): Observable<any> {
        return this.http.get<any>(`${process.env["NX_API"]}/users`)
    }

    createUser(user: any): Observable<any> {
        return this.http.post<any>(`${process.env["NX_API"]}/users/SignUp`, user);
    }

    getUser(id: string): Observable<any> {
        return this.http.get<any>(`${process.env["NX_API"]}/users/${id}`)
    }

    updateUser(id: string, user: any): Observable<any> {
        return this.http.put<any>(`${process.env["NX_API"]}/users/${id}`, user)
    }

    deleteUser(id: string): Observable<any> {
        return this.http.delete<any>(`${process.env["NX_API"]}/users/${id}`)
    }

    getCountries(): { id: string; name: string }[] {
        return Object.entries(countriesLib.getNames('en', { select: 'official' })).map((entry) => {
            return {
                id: entry[0],
                name: entry[1]
            };
        });
    }

    getCountry(countryKey: string): string {
        return countriesLib.getName(countryKey, 'en');
    }
}