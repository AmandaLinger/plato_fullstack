import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateChildFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return authService.buscarPerfil().pipe(
      map(() => true),
      catchError(() => {
        authService.clearToken();
        return of(
          router.createUrlTree(['/login'], {
            queryParams: { returnUrl: state.url },
          }),
        );
      }),
    );
  }

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};
