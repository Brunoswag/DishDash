import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../models/recipe';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-saved-recipe',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './saved-recipe.component.html',
  styleUrls: ['./saved-recipe.component.css']
})
export class SavedRecipeComponent implements OnInit {
  savedRecipes$: Observable<Recipe[]>;
  loading = true;

  @Input() recipes: Recipe[] = [];

  constructor(private recipeService: RecipeService) {
    this.savedRecipes$ = this.recipeService.savedRecipes$;
  }

  async ngOnInit(): Promise<void> {
    try {
      this.loading = true;
      await this.recipeService.loadSavedRecipes();
    } finally {
      this.loading = false;
    }
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
    await this.recipeService.toggleLike(recipe);
  }

  async toggleSave(recipe: Recipe, event: Event): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    await this.recipeService.toggleSave(recipe);
    // Refresh the saved recipes list
    this.savedRecipes$ = this.recipeService.savedRecipes$;
  }

  isLiked(recipe: Recipe): boolean {
    return this.recipeService.isLikedByUser(recipe);
  }

  isSaved(recipe: Recipe): boolean {
    return this.recipeService.isSavedByUser(recipe);
  }
}
