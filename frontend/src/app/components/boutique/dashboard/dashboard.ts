// src/app/components/boutique/dashboard/dashboard.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { FormsModule } from '@angular/forms';
import { ProduitService } from '../../../services/produit.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CurrencyPipe, SidebarComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  // ─── Infos boutique connectée ─────────────────────────
  boutique: any = null;
  nomBoutique   = '';

  // ─── KPI réels ───────────────────────────────────────
  totalProduits   = 0;
  produitsActifs  = 0;
  produitsRupture = 0;
  chiffreAffaires = 0;

  // ─── Produits réels ──────────────────────────────────
  produits: any[]        = [];
  produitsFiltres: any[] = [];
  searchTerm             = '';

  topProduits: any[] = [];
  isLoading = true;

  constructor(
    private router: Router,
    private produitService: ProduitService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.boutique    = this.authService.getBoutique();
    this.nomBoutique = this.boutique?.nom || 'Ma Boutique';
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    const boutiqueId = this.boutique?.id || '';
    this.isLoading   = true;

    this.produitService.getProduitsByBoutique(boutiqueId).subscribe({
      next: (data) => {
        this.produits        = data;
        this.produitsFiltres = [...data];

        // ── KPI corrigés ──────────────────────────────
        this.totalProduits   = data.length;
        this.produitsActifs  = data.filter((p: any) => (p.stock || 0) > 0).length;
        this.produitsRupture = data.filter((p: any) => (p.stock || 0) === 0).length;

        // ── Valeur = prix * stock ─────────────────────
        this.chiffreAffaires = data.reduce(
          (sum: number, p: any) => sum + ((p.prix || 0) * (p.stock || 0)), 0
        );

        // ── Top produits triés par valeur (prix * stock) ──
        const sorted = [...data].sort(
          (a: any, b: any) => (b.prix * b.stock) - (a.prix * a.stock)
        );
        const maxValeur = (sorted[0]?.prix || 0) * (sorted[0]?.stock || 0) || 1;
        this.topProduits = sorted.slice(0, 5).map((p: any) => ({
          nom:         p.nom,
          prix:        p.prix,
          stock:       p.stock || 0,
          valeur:      (p.prix || 0) * (p.stock || 0),
          pourcentage: Math.round(((p.prix * p.stock) / maxValeur) * 100)
        }));

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement dashboard :', err);
        this.isLoading = false;
      }
    });
  }

  // ─── Recherche ────────────────────────────────────────
  filtrerProduits(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.produitsFiltres = !term
      ? [...this.produits]
      : this.produits.filter((p: any) =>
          p.nom.toLowerCase().includes(term) ||
          (p.description || '').toLowerCase().includes(term)
        );
  }

  // ─── Actions ──────────────────────────────────────────
  editerProduit(id: string): void {
    this.router.navigate(['/produits/editer', id]);
  }

  supprimerProduit(id: string): void {
    if (confirm('Supprimer ce produit ?')) {
      this.produitService.supprimerProduit(id).subscribe(() => {
        this.chargerDonnees();
      });
    }
  }

  voirTousProduits(): void {
    this.router.navigate(['/produits']);
  }
}