import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '@frontend/products';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'admin-portal-products-list',
  templateUrl: './products-list.component.html',
  styles: [
  ]
})
export class ProductsListComponent {
  products = []

  constructor(
    private productService: ProductsService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this._getProducts();
  }

  private _getProducts() {
    this.productService.getProducts().subscribe(res => {
      this.products = res.products
    });
  }

  updateProduct(id: string) {
    this.router.navigateByUrl(`/products/form/${id}`)
  }

  deleteProduct(id: string) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this category?',
      header: 'Delete Category',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productService.deleteProduct(id).subscribe((response) => {
          if (response.success) {
            this._getProducts();
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
