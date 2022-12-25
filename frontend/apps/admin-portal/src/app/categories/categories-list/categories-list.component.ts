import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriesService } from '@frontend/products'
import { Category } from '@frontend/products';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';

@Component({
  selector: 'admin-portal-categories-list',
  templateUrl: './categories-list.component.html',
  styles: [],
})
export class CategoriesListComponent {
  categories: Category[] = []

  constructor(
    private confirmationService: ConfirmationService,
    private categoryService: CategoriesService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this._getCategories();
  }

  private _getCategories() {
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data;
    })
  }

  deleteCategory(id: string) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this category?',
      header: 'Delete Category',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.categoryService.deleteCategory(id).subscribe((response) => {
          if (response.success) {
            this._getCategories();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Oops! Something went wrong..Please try again" });
          }
        })
      },
      reject: (type) => { }
    });
  }

  updateCategory(id: string) {
    this.router.navigateByUrl(`categories/form/${id}`)
  }

}
