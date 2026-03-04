// src/app/components/client/login/client-login.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ClientService } from '../../../services/client.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  selector: 'app-client-login',
  templateUrl: './client-login.html',
  styleUrls: ['./client-login.css']
})
export class ClientLoginComponent {

  activeTab = 'login';

  // Login
  loginEmail    = '';
  loginPassword = '';

  // Register
  registerNom      = '';
  registerEmail    = '';
  registerPassword = '';

  errorMsg   = '';
  successMsg = '';
  isLoading  = false;

  constructor(
    private clientService: ClientService,
    private router: Router
  ) {}

  setTab(tab: string) {
    this.activeTab = tab;
    this.errorMsg  = '';
    this.successMsg = '';
  }

  onLogin() {
    this.errorMsg  = '';
    this.isLoading = true;
    this.clientService.login(this.loginEmail, this.loginPassword).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/client/catalogue']);
      },
      error: (err) => {
        this.errorMsg  = err.error?.message || 'Erreur de connexion';
        this.isLoading = false;
      }
    });
  }

  onRegister() {
    this.errorMsg  = '';
    this.isLoading = true;
    this.clientService.register({
      nom:      this.registerNom,
      email:    this.registerEmail,
      password: this.registerPassword
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/client/catalogue']);
      },
      error: (err) => {
        this.errorMsg  = err.error?.message || 'Erreur lors de l\'inscription';
        this.isLoading = false;
      }
    });
  }
}