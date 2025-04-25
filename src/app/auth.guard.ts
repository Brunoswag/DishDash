// Spencer Lommel 4/25/25
import { inject } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, take } from 'rxjs/operators';

export const authGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const afAuth = inject(AngularFireAuth);

  // If trying to access the login page, always allow it
  if (state.url === '/login') {
    return true;
  }

  return afAuth.authState.pipe(
    take(1),
    map((user) => {
      // If user is authenticated, allow access
      if (user) {
        return true;
      }

      // User not authenticated, redirect to login
      router.navigate(['/login']);
      return false;
    })
  );
};
