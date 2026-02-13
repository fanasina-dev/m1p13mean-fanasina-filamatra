import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';   // 👈 AJOUTE CETTE LIGNE

@Component({
  selector: 'app-produits',
  standalone: true,
  imports: [CommonModule],   // 👈 AJOUTE ICI
  templateUrl: './produits.html',
  styleUrl: './produits.css'
})
export class Produits {

  produits = [
    { nom: 'Ordinateur', prix: 3000 },
    { nom: 'Téléphone', prix: 1500 },
    { nom: 'Casque', prix: 200 }
  ];

}
