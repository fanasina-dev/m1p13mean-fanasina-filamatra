// src/app/services/client.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private apiUrl = 'http://localhost:3000/api/client';

  constructor(private http: HttpClient) {}

  register(data: { nom: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data).pipe(
      tap((res: any) => {
        localStorage.setItem('clientToken',  res.token);
        localStorage.setItem('clientInfo',   JSON.stringify(res.client));
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res: any) => {
        localStorage.setItem('clientToken',  res.token);
        localStorage.setItem('clientInfo',   JSON.stringify(res.client));
      })
    );
  }

  getCatalogue(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/catalogue`);
  }

  getProduit(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/catalogue/${id}`);
  }

  passerCommande(items: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/commandes`, { items }, { headers: this.getHeaders() });
  }

  getMesCommandes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/commandes`, { headers: this.getHeaders() });
  }

  logout(): void {
    localStorage.removeItem('clientToken');
    localStorage.removeItem('clientInfo');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('clientToken');
  }

  getToken(): string | null {
    return localStorage.getItem('clientToken');
  }

  getClient(): any {
    const c = localStorage.getItem('clientInfo');
    return c ? JSON.parse(c) : null;
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.getToken()}` });
  }
}