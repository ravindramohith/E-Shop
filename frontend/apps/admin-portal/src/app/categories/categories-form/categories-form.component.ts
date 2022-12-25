import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, Category } from '@frontend/products';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';

@Component({
  selector: 'admin-portal-categories-form',
  templateUrl: './categories-form.component.html',
  styles: [],
})
export class CategoriesFormComponent {

  form: FormGroup;
  isSubmitted = false;
  editMode = false;
  id = '';
  constructor(
    private formBuilder: FormBuilder,
    private categoriesService: CategoriesService,
    private messageService: MessageService,
    private location: Location,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      icon: ['', Validators.required],
      color: ['#fff']
    })
    this._checkEditMode();
  }

  get formControls() {
    return this.form.controls
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    const category: Category = {
      name: this.formControls.name.value,
      icon: this.formControls.icon.value,
      color: this.formControls.color.value
    }

    if (this.editMode) {
      this.updateCategory(category);
    } else {
      this.addCategory(category);
    }

  }

  private _checkEditMode() {
    this.route.params.subscribe(params => {
      if (params.id) {
        this.editMode = true;
        this.id = params.id;
        this.categoriesService.getCategory(params.id).subscribe(response => {
          this.formControls.name.setValue(response.category.name);
          this.formControls.icon.setValue(response.category.icon);
          this.formControls.color.setValue(response.category.color);
        })
      }
      else { this.editMode = false; this.id = ''; }
    })
  }

  private addCategory(category: any) {
    this.categoriesService.createCategory(category).subscribe(response => {
      if (response.success) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `Category ${category.name} created successfully!` });
        timer(2000).toPromise().then((done) => {
          this.location.back();
        })
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Oops! Something went wrong..Please try again" });
      }
    });
  }

  private updateCategory(category: any) {
    this.categoriesService.updateCategory(this.id, category).subscribe(response => {
      if (response.success) {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `Category has been updated successfully!` });
        timer(2000).toPromise().then((done) => {
          this.location.back();
        })
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Oops! Something went wrong..Please try again" });
      }
    });
  }

}
