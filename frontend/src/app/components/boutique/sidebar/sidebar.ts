import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  exact?: boolean;
  badge?: number;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent {

  isCollapsed = false;

  navItems: NavItem[] = [
    { path: '/dashboard',   label: 'Dashboard',   icon: '⊞',  exact: true },
    { path: '/produits',    label: 'Produits',    icon: '📦'               },
    { path: '/produits/ajouter', label: 'Ajouter un produit', icon: '➕', exact: true },
    // Ajoutez d'autres liens ici selon vos besoins
  ];

  constructor(private router: Router) {}

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}