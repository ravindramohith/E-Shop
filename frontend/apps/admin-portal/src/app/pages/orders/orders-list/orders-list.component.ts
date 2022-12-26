import { Component } from '@angular/core';
import { OrdersService } from '@frontend/orders';
import { ORDER_STATUS } from '../orders.constants';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'admin-portal-orders-list',
  templateUrl: './orders-list.component.html',
  styles: [
  ]
})
export class OrdersListComponent {
  orders = []
  orderStatus = ORDER_STATUS
  constructor(
    private ordersServices: OrdersService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this._getOrders();
  }

  private _getOrders() {
    this.ordersServices.getOrders().subscribe((response) => {
      if (response.success) this.orders = response.orders;
    })
  }

  viewOrder(id: string) {
    this.router.navigateByUrl(`orders/${id}`);
  }

  deleteOrder(id: string) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this order?',
      header: 'Delete Order',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ordersServices.deleteOrder(id).subscribe((response) => {
          if (response.success) {
            this._getOrders();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message ? response.message : "Oops! Something went wrong..Please try again" });
          }
        })
      },
      reject: (type) => { }
    });
  }
}
