import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

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
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css']
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
    this.recipe = await this.firebaseService.getRecipeById(id);
  }
}
