import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category, GetCategoriesServerResponse } from '../models/Category';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class CategoriesService {

  constructor(private http: HttpClient) { }

  getCategories(): Observable<any> {
    return this.http.get<any>(`${process.env["NX_API"]}/categories`)
  }

  getCategory(id: string): Observable<any> {
    return this.http.get<any>(`${process.env["NX_API"]}/categories/${id}`)
  }

  createCategory(category: Category): Observable<any> {
    return this.http.post<any>(`${process.env["NX_API"]}/categories`, category)
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete<any>(`${process.env["NX_API"]}/categories/${id}`)
  }

  updateCategory(id: string, category: any): Observable<any> {
    return this.http.put<any>(`${process.env["NX_API"]}/categories/${id}`, category)
  }
}
