import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, ProductsService } from '@frontend/products';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';

@Component({
  selector: 'admin-portal-products-form',
  templateUrl: './products-form.component.html',
  styles: [
  ]
})
export class ProductsFormComponent {
  editMode = false;
  form: FormGroup;
  isSubmitted = false;
  categories = [];
  imageDisplay: string | ArrayBuffer;
  id = ''

  get formControls() {
    return this.form.controls
  }
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
    private messageService: MessageService,
    private productsService: ProductsService,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      brand: ['', Validators.required],
      price: [0, Validators.required],
      category: ['', Validators.required],
      countInStock: ['', Validators.required],
      description: ['', Validators.required],
      richDescription: [''],
      image: ['', Validators.required],
      isFeatured: [false]
    })
    this._checkEditMode();
    this._getCategories();
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) return;
    const formData = new FormData();
    Object.keys(this.formControls).map((key) => {
      formData.append(key, this.formControls[key].value);
      console.log(key, this.formControls[key].value);
    })
    if (this.editMode) {
      this._updateProduct(formData);
    } else {
      this._addProduct(formData);
    }
  }

  private _updateProduct(product) {
    this.productsService.updateProduct(this.id, product).subscribe(
      (response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product has been updated!'
          });
          timer(2000)
            .toPromise()
            .then(() => {
              this.location.back();
            });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.message ? response.message : 'Product is not updated!'
          });
        }
      }
    );
  }

  private _addProduct(productData: FormData) {
    this.productsService.createProduct(productData).subscribe(
      (response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Product ${response.product.name} is created!`
          });
          timer(2000)
            .toPromise()
            .then(() => {
              this.location.back();
            });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.message ? response.message : 'Product is not created!'
          });
        }
      }
    );
  }

  private _checkEditMode() {
    this.route.params.subscribe(params => {
      if (params.id) {
        this.editMode = true;
        this.id = params.id;
        this.productsService.getProduct(params.id).subscribe((response) => {
          this.formControls.name.setValue(response.product.name);
          this.formControls.category.setValue(response.product.category?.id);
          this.formControls.brand.setValue(response.product.brand);
          this.formControls.price.setValue(response.product.price ? response.product.price : 0);
          this.formControls.countInStock.setValue(response.product.countInStock);
          this.formControls.isFeatured.setValue(response.product.isFeatured);
          this.formControls.description.setValue(response.product.description);
          this.formControls.richDescription.setValue(response.product.richDescription);
          this.imageDisplay = response.product.image;
          this.formControls.image.setValidators([]);
          this.formControls.image.updateValueAndValidity();
        });
      }
      else { this.editMode = false; }
    })
  }

  onImageUpload(event) {
    console.log(event)
    const file = event.target.files[0]
    if (file) {
      this.form.patchValue({ image: file });
      this.form.get('image').updateValueAndValidity();
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        this.imageDisplay = fileReader.result;
      }
    }
  }

  private _getCategories() {
    this.categoriesService.getCategories().subscribe(response => {
      if (!response.success) this.messageService.add({ severity: 'error', summary: 'Error', detail: "Oops! Something went wrong..Please try again" });
      else {
        this.categories = response.categories;
      }
    })
  }
}
