// Spencer Lommel 4/25/25

import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RecipeComponent } from './recipe/recipe.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth.guard';
import { SearchComponent } from './search/search.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { RecipeFormComponent } from './recipe-form/recipe-form.component';
import { SavedRecipeComponent } from './saved-recipe/saved-recipe.component';
import { LikedRecipeComponent } from './liked-recipe/liked-recipe.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { AboutUsComponent } from './about-us/about-us.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'search', component: SearchComponent },
  { path: 'saved', component: SavedRecipeComponent },
  { path: 'liked', component: LikedRecipeComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'about-us', component: AboutUsComponent },
  {
    path: 'profile/:username',
    component: UserProfileComponent,
  },
  { path: 'new-recipe', component: RecipeFormComponent },
  {
    path: 'recipe/:id',
    component: RecipeComponent,
    canActivate: [authGuard],
  },
  { path: 'edit-recipe/:id', component: RecipeFormComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'home' },
];
