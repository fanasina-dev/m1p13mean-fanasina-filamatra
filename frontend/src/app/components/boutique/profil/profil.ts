// src/app/components/boutique/profil/profil.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { AuthService } from '../../../services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SidebarComponent],
  selector: 'app-profil',
  templateUrl: './profil.html',
  styleUrls: ['./profil.css']
})
export class ProfilComponent implements OnInit {

  boutique: any = null;
  isLoading     = true;
  isSaving      = false;
  successMsg    = '';
  errorMsg      = '';

  // Formulaire
  form = {
    nom:             '',
    password:        '',
    confirmPassword: '',
    photo:           ''
  };

  photoPreview = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.authService.getProfil().subscribe({
      next: (data) => {
        this.boutique        = data;
        this.form.nom        = data.nom;
        this.photoPreview    = data.photo || '';
        this.isLoading       = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur profil :', err);
        this.isLoading = false;
        this.router.navigate(['/login']);
      }
    });
  }

  // ── Upload photo (base64) ──────────────────────────
  onPhotoChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.photoPreview = e.target.result;
      this.form.photo   = e.target.result;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  // ── Sauvegarde ─────────────────────────────────────
  onSubmit() {
    this.successMsg = '';
    this.errorMsg   = '';

    if (this.form.password && this.form.password !== this.form.confirmPassword) {
      this.errorMsg = 'Les mots de passe ne correspondent pas !';
      return;
    }

    const data: any = {};
    if (this.form.nom)      data.nom      = this.form.nom;
    if (this.form.password) data.password = this.form.password;
    if (this.form.photo)    data.photo    = this.form.photo;

    this.isSaving = true;
    this.authService.updateProfil(data).subscribe({
      next: (res) => {
        this.successMsg          = 'Profil mis à jour avec succès !';
        this.boutique            = res.boutique;
        this.form.password       = '';
        this.form.confirmPassword = '';
        this.form.photo          = '';
        this.isSaving            = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMsg = 'Erreur lors de la mise à jour.';
        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}