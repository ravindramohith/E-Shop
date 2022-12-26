import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '@frontend/orders';
import { ORDER_STATUS } from '../orders.constants';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'admin-portal-orders-detail',
  templateUrl: './orders-detail.component.html',
  styles: [
  ]
})
export class OrdersDetailComponent {
  order = null;
  orderStatuses = [];
  selectedStatus: any;

  constructor(
    private ordersService: OrdersService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this._mapOrderStatus();
    this._getOrder();
  }

  private _getOrder() {
    this.route.params.subscribe(params => {
      if (params.id) {
        this.ordersService.getOrder(params.id).subscribe(response => {
          this.order = response.order;
          this.selectedStatus = response.order.status;
        })
      }
    })
  }

  private _mapOrderStatus() {
    this.orderStatuses = Object.keys(ORDER_STATUS).map((key) => {
      return {
        id: key,
        name: ORDER_STATUS[key].label
      };
    });
  }

  onStatusChange(event) {
    console.log(event.value);
    this.ordersService.updateOrder(this.order.id, { status: event.value }).subscribe(
      (response) => {
        if (response.success) {
          console.log(response);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: response.message
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.message ? response.message : 'Oops Something went wrong! please Try again later'
          });
        }
      });
  }
}
