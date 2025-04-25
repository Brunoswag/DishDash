// Spencer Lommel 4/25/25

import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RecipeComponent } from './recipe/recipe.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'recipe/:id', component: RecipeComponent, canActivate: [authGuard] },

  // all protected routes should go here with authGuard
  { path: '**', redirectTo: 'home' }, // Catch all route goes to home instead of a 404 page!
];
