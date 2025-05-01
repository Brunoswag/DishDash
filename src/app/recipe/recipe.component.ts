import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FirebaseService } from '../firebase.service'; // Updated import path
import { Recipe } from '../models/recipe';
import { RecipeService } from '../services/recipe.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

@Component({
  selector: 'app-recipe',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.css',
  providers: [FirebaseService] // Add providers array to ensure FirebaseService is available
})
export class RecipeComponent implements OnInit {
  recipe: Recipe | null = null;
  author: User | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firebaseService: FirebaseService,
    private recipeService: RecipeService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const recipeId = params['id'];
      if (!recipeId) {
        this.router.navigate(['/home']);
        return;
      }
      this.loadRecipe(recipeId);
    });
  }

  async loadRecipe(id: string): Promise<void> {
    try {
      this.loading = true;
      this.error = null;
      const data = await this.firebaseService.getRecipeById(id);
      if (!data) {
        throw new Error('Recipe not found');
      }
      this.recipe = data as Recipe;
      // Load author data
      if (this.recipe.userId) {
        this.author = await this.recipeService.getRecipeAuthor(this.recipe.userId);
      }
    } catch (error) {
      console.error('Error loading recipe:', error);
      this.error = 'Failed to load recipe';
      this.router.navigate(['/home']);
    } finally {
      this.loading = false;
    }
  }

  getAuthorProfilePicture(): string {
    return this.userService.getProfilePicture(this.author);
  }

  navigateToAuthorProfile(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.author?.username) {
      this.router.navigate(['/profile', this.author.username]);
    }
  }
}
