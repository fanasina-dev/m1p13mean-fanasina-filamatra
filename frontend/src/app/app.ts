// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// // Remplace l'ancien import par celui-ci :

// import { ProduitsComponent } from './produits/produits'; // <-- importer le composant Produits

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [CommonModule, AddProduit, ProduitsComponent], // <-- ajouter ProduitsComponent ici
//   templateUrl: './app.html',
//   styleUrls: ['./app.css']
// })
// export class App {}
//ppppppppppppppppppp
// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';

// // On utilise le nom EXACT de la classe que tu as définie
// import { AjoutProduitComponent } from './components/boutique/ajout-produit/ajout-produit'; 


// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [
//     CommonModule, 
//     AjoutProduitComponent, // <-- Utilise bien AjoutProduitComponent ici aussi
//   ],
//   templateUrl: './app.html',
//   styleUrls: ['./app.css']
// })
// export class App {}
// src/app/app.ts
// src/app/app.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class App {
  title = 'frontend';
}