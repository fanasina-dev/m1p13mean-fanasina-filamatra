// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  register(data: { nom: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data).pipe(
      tap((res: any) => {
        localStorage.setItem('token',    res.token);
        localStorage.setItem('boutique', JSON.stringify(res.boutique));
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res: any) => {
        localStorage.setItem('token',    res.token);
        localStorage.setItem('boutique', JSON.stringify(res.boutique));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('boutique');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getBoutique(): any {
    const b = localStorage.getItem('boutique');
    return b ? JSON.parse(b) : null;
  }
}