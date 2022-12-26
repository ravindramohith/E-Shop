import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class OrdersService {

    constructor(private http: HttpClient) { }

    getOrders(): Observable<any> {
        return this.http.get<any>(`${process.env["NX_API"]}/orders`)
    }

    getOrder(id: string): Observable<any> {
        return this.http.get<any>(`${process.env["NX_API"]}/orders/${id}`)
    }

    createOrder(order: any): Observable<any> {
        return this.http.post<any>(`${process.env["NX_API"]}/orders`, order)
    }

    deleteOrder(id: string): Observable<any> {
        return this.http.delete<any>(`${process.env["NX_API"]}/orders/${id}`)
    }

    updateOrder(id: string, status: any): Observable<any> {
        return this.http.put<any>(`${process.env["NX_API"]}/orders/${id}`, status)
    }
}
