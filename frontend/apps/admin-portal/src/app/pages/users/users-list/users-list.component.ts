import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '@frontend/users';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'admin-portal-users-list',
  templateUrl: './users-list.component.html',
  styles: [
  ]
})
export class UsersListComponent {
  users = []
  constructor(
    private usersService: UsersService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) { }
  ngOnInit() {
    this._getUsers();
  }

  deleteUser(id: string) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this user?',
      header: 'Delete User',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usersService.deleteUser(id).subscribe((response) => {
          if (response.success) {
            this._getUsers();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message ? response.message : "Oops! Something went wrong..Please try again" });
          }
        })
      },
      reject: (type) => { }
    });
  }

  private _getUsers() {
    this.usersService.getUsers().subscribe(response => {
      if (response.success) {
        this.users = response.users
      }
    })
  }

  updateUser(id: string) {
    this.router.navigateByUrl(`/users/form/${id}`)
  }

  getCountryName(countryKey: string) {
    return this.usersService.getCountry(countryKey);
  }
}
