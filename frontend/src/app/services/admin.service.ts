// src/app/services/admin.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'http://localhost:3000/api/admin';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res: any) => {
        localStorage.setItem('adminToken', res.token);
      })
    );
  }

  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`, { headers: this.getHeaders() });
  }

  getBoutiques(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/boutiques`, { headers: this.getHeaders() });
  }

  deleteBoutique(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/boutiques/${id}`, { headers: this.getHeaders() });
  }

  getProduits(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/produits`, { headers: this.getHeaders() });
  }

  logout(): void {
    localStorage.removeItem('adminToken');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('adminToken');
  }

  getToken(): string | null {
    return localStorage.getItem('adminToken');
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.getToken()}` });
  }
}