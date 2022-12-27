import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';


const routes: Routes = [
  { path: 'login', component: LoginComponent }
]

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), FormsModule, ReactiveFormsModule, InputTextModule, ButtonModule],
  declarations: [
    LoginComponent
  ],
})
export class UsersModule { }
