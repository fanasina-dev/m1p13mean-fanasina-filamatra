// src/app/services/produit.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {

  private apiUrl = 'http://localhost:3000/api/produits';

  constructor(private http: HttpClient) {}

  // Tous les produits (toutes boutiques)
  getProduits(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // ── Produits d'une boutique spécifique ────────────────
  getProduitsByBoutique(boutiqueId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/boutique/${boutiqueId}`);
  }

  // Un seul produit par ID
  getProduitById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Ajout
  addProduit(produit: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, produit);
  }

  // Modification
  modifierProduit(id: string, produit: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, produit);
  }

  // Suppression
  supprimerProduit(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}