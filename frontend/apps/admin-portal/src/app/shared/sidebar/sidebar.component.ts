import { Component } from '@angular/core';
import { AuthService } from '@frontend/users';

@Component({
  selector: 'admin-portal-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  constructor(private auth: AuthService) { }
  logoutUser() {
    this.auth.Logout();
  }
}
