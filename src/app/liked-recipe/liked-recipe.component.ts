import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../models/recipe';
import { Observable, Subscription } from 'rxjs';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-liked-recipe',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './liked-recipe.component.html',
  styleUrls: ['./liked-recipe.component.css']
})
export class LikedRecipeComponent implements OnInit, OnDestroy {
  likedRecipes$: Observable<Recipe[]>;
  loading = true;
  error: string | null = null;
  private userSubscription?: Subscription;

  @Input() recipes: Recipe[] = [];

  constructor(
    private recipeService: RecipeService,
    private userService: UserService
  ) {
    this.likedRecipes$ = this.recipeService.likedRecipes$;
  }

  async ngOnInit(): Promise<void> {
    // Subscribe to user changes to reload data when user state changes
    this.userSubscription = this.userService.currentUser$.subscribe(async (user) => {
      if (user) {
        await this.loadData();
      } else {
        this.loading = false;
      }
    });
  }

  private async loadData(): Promise<void> {
    try {
      this.loading = true;
      this.error = null;
      await this.recipeService.loadLikedRecipes();
    } catch (err) {
      console.error('Error loading liked recipes:', err);
      this.error = 'Failed to load liked recipes';
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
    // Refresh the liked recipes list
    await this.loadData();
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

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }
} 