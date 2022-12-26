import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class ProductsService {
    constructor(private http: HttpClient) { }

    getProducts(): Observable<any> {
        return this.http.get<any>(`${process.env["NX_API"]}/products`)
    }

    createProduct(product: any): Observable<any> {
        return this.http.post<any>(`${process.env["NX_API"]}/products`, product);
    }

    getProduct(id: string): Observable<any> {
        return this.http.get<any>(`${process.env["NX_API"]}/products/${id}`)
    }

    updateProduct(id: string, product: any): Observable<any> {
        return this.http.put<any>(`${process.env["NX_API"]}/products/${id}`, product)
    }

    deleteProduct(id: string): Observable<any> {
        return this.http.delete<any>(`${process.env["NX_API"]}/products/${id}`)
    }
}