// src/app/components/admin/dashboard/admin-dashboard.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {

  isLoading       = true;
  activeTab       = 'boutiques';

  // Stats
  totalBoutiques  = 0;
  totalProduits   = 0;
  valeurTotale    = 0;

  // Data
  boutiques: any[] = [];
  produits:  any[] = [];

  constructor(
    private adminService: AdminService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.chargerStats();
    this.chargerProduits();
  }

  chargerStats() {
    this.adminService.getStats().subscribe({
      next: (data) => {
        this.totalBoutiques = data.totalBoutiques;
        this.totalProduits  = data.totalProduits;
        this.valeurTotale   = data.valeurTotale;
        this.boutiques      = data.boutiques;
        this.isLoading      = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur stats :', err);
        this.isLoading = false;
        this.router.navigate(['/admin/login']);
      }
    });
  }

  chargerProduits() {
    this.adminService.getProduits().subscribe({
      next: (data) => {
        this.produits = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erreur produits :', err)
    });
  }

  supprimerBoutique(id: string, nom: string) {
    if (confirm(`Supprimer la boutique "${nom}" et tous ses produits ?`)) {
      this.adminService.deleteBoutique(id).subscribe({
        next: () => {
          this.chargerStats();
          this.chargerProduits();
        },
        error: (err) => console.error('Erreur suppression :', err)
      });
    }
  }

  setTab(tab: string) {
    this.activeTab = tab;
  }

  logout() {
    this.adminService.logout();
    this.router.navigate(['/admin/login']);
  }
}