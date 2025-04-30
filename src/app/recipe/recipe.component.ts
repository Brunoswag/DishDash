import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../firebase.service';

interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  ingredients: Array<{
    name: string;
    amount: number;
    unit: string;
  }>;
  instructions: string[];
}

@Component({
  selector: 'app-recipe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.css'
})
export class RecipeComponent implements OnInit {
  recipe: Recipe | null = null;

  constructor(
    private route: ActivatedRoute,
    private firebaseService: FirebaseService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const recipeId = params['id'];
      this.loadRecipe(recipeId);
    });
  }

  private async loadRecipe(id: string): Promise<void> {
    try {
      const recipeData = await this.firebaseService.getRecipeById(id);
      // Type assertion to ensure the data matches our Recipe interface
      this.recipe = recipeData as Recipe;
    } catch (error) {
      console.error('Error loading recipe:', error);
    }
  }
}
