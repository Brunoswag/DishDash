// Spencer Lommel 4/28/25

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { UserService } from '../services/user.service';
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
  imageFile: File | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    private storage: Storage,
    private userService: UserService,
    private router: Router
  ) {
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
    const files = event.target.files;
    if (files.length > 0) {
      this.imageFile = files[0];
    }
  }

  async uploadImage(file: File): Promise<string> {
    const storageRef = ref(this.storage, `recipe-images/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  }

  async onSubmit() {
    if (this.recipeForm.invalid) {
      return;
    }

    this.loading = true;
    const currentUser = this.userService.getCurrentUser();

    if (!currentUser) {
      alert('You must be logged in to create a recipe');
      return;
    }

    try {
      let imageUrl = '';
      if (this.imageFile) {
        imageUrl = await this.uploadImage(this.imageFile);
      }

      const recipe: Recipe = {
        userId: currentUser.uid,
        name: this.recipeForm.value.name,
        description: this.recipeForm.value.description,
        imageUrl: imageUrl,
        tags: this.tags,
        ingredients: this.recipeForm.value.ingredients,
        directions: this.recipeForm.value.directions,
        createdAt: new Date(),
        likes: 0, // Add initial values for required fields
        saves: 0,
        likedBy: [], // Initialize empty arrays
        savedBy: []
      };

      const recipesRef = collection(this.firestore, 'recipes');
      await addDoc(recipesRef, recipe);

      alert('Recipe created successfully!');
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error creating recipe:', error);
      alert('Failed to create recipe. Please try again.');
    } finally {
      this.loading = false;
    }
  }
}
