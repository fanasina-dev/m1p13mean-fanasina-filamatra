// src/app/components/admin/login/admin-login.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdminService } from '../../../services/admin.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  selector: 'app-admin-login',
  templateUrl: './admin-login.html',
  styleUrls: ['./admin-login.css']
})
export class AdminLoginComponent {

  email     = '';
  password  = '';
  errorMsg  = '';
  isLoading = false;

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  onLogin() {
    this.errorMsg  = '';
    this.isLoading = true;

    console.log('=== onLogin admin ===');
    console.log('email :', this.email);
    console.log('password :', this.password);

    this.adminService.login(this.email, this.password).subscribe({
      next: (res) => {
        console.log('Login admin réussi :', res);
        this.isLoading = false;
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        console.error('Erreur login admin :', err);
        this.errorMsg  = err.error?.message || 'Erreur de connexion';
        this.isLoading = false;
      }
    });
  }
}