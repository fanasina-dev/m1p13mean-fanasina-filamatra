// src/app/components/boutique/login/login.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  mode: 'login' | 'register' = 'login';

  loginData    = { email: '', password: '' };
  registerData = { nom: '', email: '', password: '' };

  erreur  = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin() {
    this.erreur  = '';
    this.loading = true;
    this.authService.login(this.loginData.email, this.loginData.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.erreur  = err.error?.message || 'Email ou mot de passe incorrect';
      }
    });
  }

  onRegister() {
    this.erreur  = '';
    this.loading = true;
    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.erreur  = err.error?.message || 'Erreur lors de l\'inscription';
      }
    });
  }
}