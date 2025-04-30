import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from '../firebase.service';
import { Recipe } from '../models/recipe';

@Component({
  selector: 'app-recipe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
})
export class RecipeComponent implements OnInit {
  recipe: Recipe | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firebaseService: FirebaseService
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

  private async loadRecipe(id: string): Promise<void> {
    try {
      this.loading = true;
      this.error = null;
      const data = await this.firebaseService.getRecipeById(id);
      console.log('Recipe data:', data);
      if (!data) {
        throw new Error('Recipe not found');
      }
      this.recipe = data as Recipe;
    } catch (error) {
      console.error('Error loading recipe:', error);
      this.error = 'Failed to load recipe';
      this.router.navigate(['/home']);
    } finally {
      this.loading = false;
    }
  }
}
