// src/app/components/boutique/get-produit/get-produit.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProduitService } from '../../../services/produit.service';
import { AuthService } from '../../../services/auth.service';
import { SidebarComponent } from '../sidebar/sidebar';

@Component({
  selector: 'app-liste-produits',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './get-produit.html',
  styleUrls: ['./get-produit.css']
})
export class ListeProduitsComponent implements OnInit {

  produits: any[] = [];

  constructor(
    private produitService: ProduitService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.chargerProduits();
  }

  chargerProduits() {
    const boutique   = this.authService.getBoutique();
    const boutiqueId = boutique?.id || '';
    console.log('Boutique connectée :', boutique);

    this.produitService.getProduitsByBoutique(boutiqueId).subscribe({
      next: (data) => {
        this.produits = data;
        console.log('Produits récupérés :', this.produits);
      },
      error: (err) => {
        console.error('Erreur de récupération :', err);
      }
    });
  }

  supprimer(id: string) {
    if (confirm('Supprimer ce produit ?')) {
      this.produitService.supprimerProduit(id).subscribe(() => {
        this.chargerProduits();
      });
    }
  }

  editer(id: string) {
    this.router.navigate(['/produits/editer', id]);
  }
}