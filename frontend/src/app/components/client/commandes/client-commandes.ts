// src/app/components/client/commandes/client-commandes.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ClientService } from '../../../services/client.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-client-commandes',
  templateUrl: './client-commandes.html',
  styleUrls: ['./client-commandes.css']
})
export class ClientCommandesComponent implements OnInit {

  commandes: any[] = [];
  isLoading = true;
  client: any;

  constructor(
    private clientService: ClientService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.client = this.clientService.getClient();
    this.clientService.getMesCommandes().subscribe({
      next: (data) => {
        this.commandes = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur commandes :', err);
        this.isLoading = false;
        this.router.navigate(['/client/login']);
      }
    });
  }

  logout() {
    this.clientService.logout();
    this.router.navigate(['/client/login']);
  }
}