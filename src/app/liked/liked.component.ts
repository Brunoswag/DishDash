import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../models/recipe';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-liked-recipe',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './liked.component.html',
  styleUrls: ['./liked.component.css']
})
export class LikedRecipeComponent implements OnInit {
  likedRecipes$: Observable<Recipe[]>;
  loading = true;

  constructor(private recipeService: RecipeService) {
    this.likedRecipes$ = this.recipeService.likedRecipes$;
  }

  async ngOnInit(): Promise<void> {
    try {
      this.loading = true;
      await this.recipeService.loadLikedRecipes();
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
  }

  isLiked(recipe: Recipe): boolean {
    return this.recipeService.isLikedByUser(recipe);
  }

  isSaved(recipe: Recipe): boolean {
    return this.recipeService.isSavedByUser(recipe);
  }
}
