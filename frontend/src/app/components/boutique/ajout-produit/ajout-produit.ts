// src/app/components/boutique/ajout-produit/ajout-produit.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProduitService } from '../../../services/produit.service';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar';
import { AuthService } from '../../../services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SidebarComponent],
  selector: 'app-ajout-produit',
  templateUrl: './ajout-produit.html',
  styleUrls: ['./ajout-produit.css']
})
export class AjoutProduitComponent implements OnInit {

  isEditMode = false;
  produitId  = '';
  isLoading  = true;

  nouveauProduit = {
    nom:         '',
    description: '',
    prix:        0,
    stock:       0,
    boutique:    ''
  };

  constructor(
    private produitService: ProduitService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private cdr: ChangeDetectorRef  // ← ajouter
  ) {
    const boutique = this.authService.getBoutique();
    this.nouveauProduit.boutique = boutique?.id || '';
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.produitId  = params['id'] || '';
      this.isEditMode = !!this.produitId;

      if (this.isEditMode) {
        this.produitService.getProduitById(this.produitId).subscribe({
          next: (produit) => {
            this.nouveauProduit.nom         = produit.nom;
            this.nouveauProduit.description = produit.description;
            this.nouveauProduit.prix        = produit.prix;
            this.nouveauProduit.stock       = produit.stock || 0;
            this.nouveauProduit.boutique    = produit.boutique?._id || produit.boutique || this.nouveauProduit.boutique;
            this.isLoading = false;
            this.cdr.detectChanges();  // ← force la mise à jour
          },
          error: (err) => {
            console.error('Erreur :', err);
            this.isLoading = false;
            this.cdr.detectChanges();
            this.router.navigate(['/produits']);
          }
        });
      } else {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit() {
    if (this.isEditMode) {
      this.produitService.modifierProduit(this.produitId, this.nouveauProduit).subscribe({
        next: (res) => {
          console.log('Produit modifié !', res);
          alert('Produit modifié avec succès');
          this.router.navigate(['/produits']);
        },
        error: (err) => {
          console.error('Erreur modification :', err);
          alert('Erreur lors de la modification');
        }
      });
    } else {
      this.produitService.addProduit(this.nouveauProduit).subscribe({
        next: (res) => {
          console.log('Produit ajouté !', res);
          alert('Produit enregistré avec succès');
          this.router.navigate(['/produits']);
        },
        error: (err) => {
          console.error('Erreur ajout :', err);
          alert('Erreur lors de l\'ajout');
        }
      });
    }
  }
}