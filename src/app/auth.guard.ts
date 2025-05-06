// Spencer Lommel 4/25/25
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

export const authGuard = async () => {
  const auth = inject(Auth);
  const router = inject(Router);


  
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) {
        console.log('Auth guard: User is authenticated'); // Debug log
        resolve(true);
      } else {
        console.log('Auth guard: User is not authenticated'); // Debug log
        router.navigate(['/login']);
        resolve(false);
      }
    });
  });
};
