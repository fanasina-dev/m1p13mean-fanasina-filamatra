// src/app/guards/client.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ClientService } from '../services/client.service';

export const clientGuard: CanActivateFn = () => {
  const clientService = inject(ClientService);
  const router        = inject(Router);
  if (clientService.isLoggedIn()) return true;
  router.navigate(['/client/login']);
  return false;
};