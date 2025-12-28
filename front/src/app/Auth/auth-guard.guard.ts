import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/Auth/auth.service';
import { Rol } from '../interfaces/Usuario';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    return router.createUrlTree(['/auth'], { queryParams: { returnUrl: state.url } });
  }
  const required = route.data?.['types'] as Rol[] | Rol | undefined;
  if (required && !auth.hasType(required)) {
    return router.createUrlTree(['/forbidden']);
  }
  return true;
};
