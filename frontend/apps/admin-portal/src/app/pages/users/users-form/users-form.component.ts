import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '@frontend/users';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';

@Component({
  selector: 'admin-portal-users-form',
  templateUrl: './users-form.component.html',
  styles: []
})
export class UsersFormComponent implements OnInit {
  form: FormGroup;
  isSubmitted = false;
  editmode = false;
  currentUserId: string;
  countries = [];

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private location: Location,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this._initUserForm();
    this._getCountries();
    this._checkEditMode();
  }

  private _initUserForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      isAdmin: [false],
      street: [''],
      apartment: [''],
      zip: [''],
      city: [''],
      country: ['']
    });
  }

  private _getCountries() {
    this.countries = this.usersService.getCountries();
    console.log(this.countries);
  }

  private _addUser(user: any) {
    this.usersService.createUser(user).subscribe(
      (response: any) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `${response.user.name} is created!`
          });
          timer(2000)
            .toPromise()
            .then(() => {
              this.location.back();
            });
        }
        else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.message ? response.message : 'User is not created!'
          });
        }
      })
  }

  private _updateUser(user: any) {
    this.usersService.updateUser(this.currentUserId, user).subscribe(
      (response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User is updated!'
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
            detail: response.message ? response.message : 'User is not updated!'
          });
        }
      }
    );
  }

  private _checkEditMode() {
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.editmode = true;
        this.currentUserId = params.id;
        this.usersService.getUser(params.id).subscribe((response) => {
          this.userForm.name.setValue(response.user.name);
          this.userForm.email.setValue(response.user.email);
          this.userForm.phone.setValue(response.user.phone);
          this.userForm.isAdmin.setValue(response.user.isAdmin);
          this.userForm.street.setValue(response.user.street);
          this.userForm.apartment.setValue(response.user.apartment);
          this.userForm.zip.setValue(response.user.zip);
          this.userForm.city.setValue(response.user.city);
          this.userForm.country.setValue(response.user.country);
          this.userForm.password.setValidators([]);
          this.userForm.password.updateValueAndValidity();
        });
      }
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    const user = {
      id: this.currentUserId,
      name: this.userForm.name.value,
      email: this.userForm.email.value,
      phone: this.userForm.phone.value,
      isAdmin: this.userForm.isAdmin.value,
      street: this.userForm.street.value,
      apartment: this.userForm.apartment.value,
      zip: this.userForm.zip.value,
      city: this.userForm.city.value,
      country: this.userForm.country.value,
      passwordHash: this.userForm.password.value,
    };
    if (this.editmode) {
      this._updateUser(user);
    } else {
      this._addUser(user);
    }
  }

  onCancle() {
    this.location.back();
  }

  get userForm() {
    return this.form.controls;
  }
}
