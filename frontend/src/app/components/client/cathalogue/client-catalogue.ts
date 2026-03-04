// src/app/components/client/catalogue/client-catalogue.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ClientService } from '../../../services/client.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-client-catalogue',
  templateUrl: './client-catalogue.html',
  styleUrls: ['./client-catalogue.css']
})
export class ClientCatalogueComponent implements OnInit {

  produits:  any[] = [];
  panier:    any[] = [];
  isLoading  = true;
  showPanier = false;
  commandeMsg = '';

  client: any;

  constructor(
    private clientService: ClientService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.client = this.clientService.getClient();
    this.clientService.getCatalogue().subscribe({
      next: (data) => {
        this.produits  = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur catalogue :', err);
        this.isLoading = false;
      }
    });
  }

  ajouterAuPanier(produit: any) {
    const existant = this.panier.find(p => p.produit === produit._id);
    if (existant) {
      existant.quantite++;
    } else {
      this.panier.push({
        produit:  produit._id,
        nom:      produit.nom,
        prix:     produit.prix,
        quantite: 1
      });
    }
    this.cdr.detectChanges();
  }

  retirerDuPanier(index: number) {
    this.panier.splice(index, 1);
    this.cdr.detectChanges();
  }

  getTotal(): number {
    return this.panier.reduce((sum, p) => sum + (p.prix * p.quantite), 0);
  }

  getNbArticles(): number {
    return this.panier.reduce((sum, p) => sum + p.quantite, 0);
  }

  togglePanier() {
    this.showPanier = !this.showPanier;
  }

  passerCommande() {
    if (this.panier.length === 0) return;
    if (!this.clientService.isLoggedIn()) {
      this.router.navigate(['/client/login']);
      return;
    }
    this.clientService.passerCommande(this.panier).subscribe({
      next: () => {
        this.commandeMsg = '🎉 Commande passée avec succès !';
        this.panier      = [];
        this.showPanier  = false;
        this.cdr.detectChanges();
        setTimeout(() => { this.commandeMsg = ''; this.cdr.detectChanges(); }, 4000);
      },
      error: (err) => {
        console.error('Erreur commande :', err);
        this.commandeMsg = '❌ Erreur lors de la commande.';
        this.cdr.detectChanges();
      }
    });
  }

  logout() {
    this.clientService.logout();
    this.router.navigate(['/client/login']);
  }
}