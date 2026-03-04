// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { clientGuard } from './guards/client.guard';

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

  // ── Routes protégées boutique ──────────────────────────
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
  {
    path: 'profil',
    loadComponent: () =>
      import('./components/boutique/profil/profil')
        .then(m => m.ProfilComponent),
    canActivate: [authGuard],
    title: 'Mon Profil'
  },

  // ── Routes admin ───────────────────────────────────────
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./components/admin/login/admin-login')
        .then(m => m.AdminLoginComponent),
    title: 'Admin Login'
  },
  {
    path: 'admin/dashboard',
    loadComponent: () =>
      import('./components/admin/dashboard/admin-dashboard')
        .then(m => m.AdminDashboardComponent),
    canActivate: [adminGuard],
    title: 'Admin Dashboard'
  },

  // ── Routes client ──────────────────────────────────────
  {
    path: 'client/login',
    loadComponent: () =>
      import('./components/client/login/client-login')
        .then(m => m.ClientLoginComponent),
    title: 'Client Login'
  },
  {
    path: 'client/catalogue',
    loadComponent: () =>
      import('./components/client/cathalogue/client-catalogue')
        .then(m => m.ClientCatalogueComponent),
    title: 'Catalogue'
  },
  {
    path: 'client/commandes',
    loadComponent: () =>
      import('./components/client/commandes/client-commandes')
        .then(m => m.ClientCommandesComponent),
    canActivate: [clientGuard],
    title: 'Mes Commandes'
  },

  // ── Page inconnue ──────────────────────────────────────
  { path: '**', redirectTo: 'login' }
];