import { Component } from '@angular/core';

@Component({
  selector: 'app-recipe-detail',
  imports: [],
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.css'
})
export class RecipeDetailComponent {
  recipeID = null;
  
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
