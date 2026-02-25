import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // <-- Indispensable
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private apiUrl = 'http://localhost:3000/api/produits';

  constructor(private http: HttpClient) { }

  // Liste pour ton binôme (Client)
  getProduits(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Ajout pour TOI (Boutique)
  addProduit(produit: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, produit);
  }

  // Suppression pour TOI (Boutique)
  supprimerProduit(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}