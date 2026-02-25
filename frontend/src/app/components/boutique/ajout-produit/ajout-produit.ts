import { Component } from '@angular/core';
import { ProduitService } from '../../../services/produit.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true, // <--- AJOUTE CETTE LIGNE ICI
  imports: [CommonModule, FormsModule],
  selector: 'app-ajout-produit',
  templateUrl: './ajout-produit.html',
  styleUrls: ['./ajout-produit.css']
})
export class AjoutProduitComponent {
  // L'objet qui va recevoir les données du formulaire
  nouveauProduit = {
    nom: 'provende',
    description: 'lfl',
    prix: 0,
    boutique: '6997651bf8576c11a1c96644' // Mets ici l'ID que tu as testé sur Postman
  };

  constructor(
    private produitService: ProduitService,
    private router: Router
  ) {}

  onSubmit() {
    this.produitService.addProduit(this.nouveauProduit).subscribe({
      next: (res) => {
        console.log('Produit ajouté !', res);
        alert('Produit enregistré avec succès');
        this.router.navigate(['/boutique']); // Redirige vers la liste après l'ajout
      },
      error: (err) => {
        console.error('Erreur :', err);
        alert('Erreur lors de l\'ajout');
      }
    });
  }
}