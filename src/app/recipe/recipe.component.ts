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

  anDelete(): boolean {
    const currentUser = this.userService.getCurrentUserSync(); // You may need a sync version
    return currentUser?.uid === this.recipe?.userId;
  }
  
  canDelete(): boolean {
    const currentUser = this.userService.getCurrentUserSync(); // You may need a sync version
    return currentUser?.uid === this.recipe?.userId;
  }

  async deleteRecipe(): Promise<void> {
    if (!this.recipe?.id) return;
  
    const confirmDelete = confirm('Are you sure you want to delete this recipe?');
    if (!confirmDelete) return;
  
    try {
      await this.recipeService.deleteRecipe(this.recipe.id);
      this.router.navigate(['/profile', this.author?.username || '']);
    } catch (error) {
      console.error('Failed to delete recipe:', error);
      alert('Error deleting recipe');
    }
  }

  canEdit(): boolean {
    const currentUser = this.userService.getCurrentUserSync();
    return currentUser?.uid === this.recipe?.userId;
  }
  
  editRecipe(): void {
    if (this.recipe?.id) {
      this.router.navigate(['/new-recipe', this.recipe.id]);
    }
  }
}
