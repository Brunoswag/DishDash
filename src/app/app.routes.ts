import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RecipeComponent } from './recipe/recipe.component';
export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'recipe:id', component: RecipeComponent },
];
