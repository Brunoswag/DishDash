// Spencer Lommel 4/25/25

import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RecipeComponent } from './recipe/recipe.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth.guard';
import { SearchComponent } from './search/search.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { RecipeFormComponent } from './recipe-form/recipe-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'search', component: SearchComponent },
  { path: 'saved', component: RecipeListComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'new-recipe', component: RecipeFormComponent },
  { 
    path: 'recipe/:id', 
    component: RecipeComponent,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'home' }
];
