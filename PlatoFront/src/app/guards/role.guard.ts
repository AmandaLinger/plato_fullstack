import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { NivelAcesso } from '../models/auth.models';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const roles = (route.data['roles'] ?? []) as readonly NivelAcesso[];
  if (authService.hasAnyRole(roles)) return true;
  const acesso = authService.getNivelAcesso();
  return router.createUrlTree([acesso === 'ROOT' ? '/admin/restaurantes' : '/home']);
};
