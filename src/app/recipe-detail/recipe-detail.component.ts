import { Component } from '@angular/core';
import { RecipeFormComponent } from '../recipe-form/recipe-form.component'; 
@Component({
  selector: 'app-recipe-detail',
  imports: [],
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.css'
})
export class RecipeDetailComponent {
  recipeID: number = 0;
  recipeAuthor: number = 0;

  thumbnailImage: String = '';
  optionalImages: String[] = [];
  recipeName: String = '';
  recipeDescription: String = '';
  
  introText: String = '';
  introImage: String = '';
  
  closingText: String = '';
  closingImage: String = '';
  
  warningText: String = '';
  warningImage: String = '';
  
  recipeStepText: String[] = [];
  recipeStepImage: String[] = [];

}
