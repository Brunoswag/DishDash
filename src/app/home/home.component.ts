import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Recipe } from '../models/recipe';
import { RecipeService } from '../services/recipe.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  recipes$: Observable<Recipe[]>;

  constructor(
    private firestore: Firestore,
    private recipeService: RecipeService,
    private userService: UserService
  ) {
    this.recipes$ = of([]); // Initialize with empty array
  }

  ngOnInit(): void {
    const recipesCollection = collection(this.firestore, 'recipes');
    this.recipes$ = collectionData(recipesCollection, { idField: 'id' }).pipe(
      map(recipes => recipes.map(recipe => ({
        ...recipe,
        likes: recipe['likes'] || 0,
        saves: recipe['saves'] || 0,
        likedBy: recipe['likedBy'] || [],
        savedBy: recipe['savedBy'] || [],
        imageUrl: recipe['imageUrl'] || 'https://placehold.co/600x400/png?text=Recipe'
      })) as Recipe[]),
      catchError(error => {
        console.error('Error fetching recipes:', error);
        return of([]);
      })
    );
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'https://placehold.co/600x400/png?text=Recipe';
    }
  }

  async toggleLike(recipe: Recipe, event: Event): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    if (!this.userService.getCurrentUser()) {
      // Redirect to login if user is not authenticated
      return;
    }
    await this.recipeService.toggleLike(recipe);
  }

  async toggleSave(recipe: Recipe, event: Event): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    if (!this.userService.getCurrentUser()) {
      // Redirect to login if user is not authenticated
      return;
    }
    await this.recipeService.toggleSave(recipe);
  }

  isLiked(recipe: Recipe): boolean {
    return this.recipeService.isLikedByUser(recipe);
  }

  isSaved(recipe: Recipe): boolean {
    return this.recipeService.isSavedByUser(recipe);
  }
}
