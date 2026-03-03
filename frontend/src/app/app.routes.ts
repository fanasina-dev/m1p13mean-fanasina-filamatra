// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

  // ── Page publique ──────────────────────────────────────
  {
    path: 'login',
    loadComponent: () =>
      import('./components/boutique/login/login')
        .then(m => m.LoginComponent),
    title: 'Connexion'
  },

  // ── Redirection par défaut ─────────────────────────────
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // ── Routes protégées ───────────────────────────────────
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/boutique/dashboard/dashboard')
        .then(m => m.DashboardComponent),
    canActivate: [authGuard],
    title: 'Dashboard'
  },
  {
    path: 'produits',
    loadComponent: () =>
      import('./components/boutique/get-produit/get-produit')
        .then(m => m.ListeProduitsComponent),
    canActivate: [authGuard],
    title: 'Mes Produits'
  },
  {
    path: 'produits/ajouter',
    loadComponent: () =>
      import('./components/boutique/ajout-produit/ajout-produit')
        .then(m => m.AjoutProduitComponent),
    canActivate: [authGuard],
    title: 'Ajouter un produit'
  },
  {
    path: 'produits/editer/:id',
    loadComponent: () =>
      import('./components/boutique/ajout-produit/ajout-produit')
        .then(m => m.AjoutProduitComponent),
    canActivate: [authGuard],
    title: 'Modifier un produit'
  },

  // ── Page inconnue ──────────────────────────────────────
  { path: '**', redirectTo: 'login' }
];