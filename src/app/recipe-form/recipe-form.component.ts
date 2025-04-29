// Spencer Lommel 4/28/25

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Recipe } from '../models/recipe';
import { Ingredient } from '../models/ingredient';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './recipe-form.component.html',
  styleUrl: './recipe-form.component.css'
})
export class RecipeFormComponent {
  recipeForm: FormGroup;
  tags: string[] = [];
  tagInput: string = '';

  constructor(private fb: FormBuilder) {
    this.recipeForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      image: [''],
      ingredients: this.fb.array([]),
      directions: this.fb.array([])
    });
  }

  // Getters for form arrays
  get ingredients() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get directions() {
    return this.recipeForm.get('directions') as FormArray;
  }

  // Methods for managing ingredients
  addIngredient() {
    const ingredientGroup = this.fb.group({
      name: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(0)]],
      unit: ['', Validators.required]
    });
    this.ingredients.push(ingredientGroup);
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  // Methods for managing directions
  addDirection() {
    this.directions.push(this.fb.control('', Validators.required));
  }

  removeDirection(index: number) {
    this.directions.removeAt(index);
  }

  // Methods for managing tags
  addTag() {
    if (this.tagInput.trim() && !this.tags.includes(this.tagInput.trim())) {
      this.tags.push(this.tagInput.trim());
      this.tagInput = '';
    }
  }

  removeTag(tag: string) {
    this.tags = this.tags.filter(t => t !== tag);
  }

  // Handle image upload
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Here you would typically handle the file upload
      // For now, we'll just store the file name
      this.recipeForm.patchValue({
        image: file.name
      });
    }
  }

  onSubmit() {
    if (this.recipeForm.valid) {
      const recipe: Recipe = {
        ...this.recipeForm.value,
        tags: this.tags
      };
      console.log(recipe);
      // Here you would typically send the recipe to your backend
    }
  }
}
