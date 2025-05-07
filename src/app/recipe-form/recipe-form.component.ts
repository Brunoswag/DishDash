// Spencer Lommel 4/28/25

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Firestore, collection, addDoc, doc, updateDoc } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { UserService } from '../services/user.service';
import { Recipe } from '../models/recipe';
import { Ingredient } from '../models/ingredient';
import { RecipeService } from '../services/recipe.service';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './recipe-form.component.html',
  styleUrl: './recipe-form.component.css'
})
export class RecipeFormComponent implements OnInit {
  recipeForm: FormGroup;
  tags: string[] = [];
  tagInput: string = '';
  imageFile: File | null = null;
  loading = false;
  editMode = false;
  recipeId: string | null = null;
  originalImageUrl: string = '';

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    private storage: Storage,
    private userService: UserService,
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
    private firebaseService: FirebaseService
  ) {
    this.recipeForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      image: [''],
      ingredients: this.fb.array([]),
      directions: this.fb.array([])
    });
  }
  
  ngOnInit(): void {
    this.route.params.subscribe(async params => {
      const id = params['id'];
      if (id) {
        this.editMode = true;
        this.recipeId = id;
        await this.loadRecipeForEdit(id);
      }
    });
  }

  async loadRecipeForEdit(id: string) {
    this.loading = true;
    try {
      const recipe = await this.firebaseService.getRecipeById(id) as Recipe;
      if (!recipe) {
        alert('Recipe not found');
        this.router.navigate(['/home']);
        return;
      }
      const currentUser = this.userService.getCurrentUser();
      if (!currentUser || recipe.userId !== currentUser.uid) {
        alert('You are not authorized to edit this recipe.');
        this.router.navigate(['/home']);
        return;
      }
      this.recipeForm.patchValue({
        name: recipe.name,
        description: recipe.description,
        image: recipe.imageUrl || ''
      });
      this.tags = recipe.tags || [];
      this.originalImageUrl = recipe.imageUrl || '';
      // Populate ingredients
      this.ingredients.clear();
      (recipe.ingredients || []).forEach((ing: any) => {
        this.ingredients.push(this.fb.group({
          name: [ing.name, Validators.required],
          quantity: [ing.quantity, [Validators.required, Validators.min(0)]],
          unit: [ing.unit, Validators.required]
        }));
      });
      // Populate directions
      this.directions.clear();
      (recipe.directions || []).forEach((dir: string) => {
        this.directions.push(this.fb.control(dir, Validators.required));
      });
    } catch (error) {
      alert('Failed to load recipe for editing.');
      this.router.navigate(['/home']);
    } finally {
      this.loading = false;
    }
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
      let imageUrl = this.originalImageUrl;
      if (this.imageFile) {
        imageUrl = await this.uploadImage(this.imageFile);
      }

      if (this.editMode && this.recipeId) {
        // Update existing recipe
        const recipeRef = doc(this.firestore, 'recipes', this.recipeId);
        await updateDoc(recipeRef, {
          name: this.recipeForm.value.name,
          description: this.recipeForm.value.description,
          imageUrl: imageUrl,
          tags: this.tags,
          ingredients: this.recipeForm.value.ingredients,
          directions: this.recipeForm.value.directions
        });
        alert('Recipe updated successfully!');
        this.router.navigate(['/recipe', this.recipeId]);
      } else {
        // Create new recipe
        const recipe: Recipe = {
          userId: currentUser.uid,
          name: this.recipeForm.value.name,
          description: this.recipeForm.value.description,
          imageUrl: imageUrl,
          tags: this.tags,
          ingredients: this.recipeForm.value.ingredients,
          directions: this.recipeForm.value.directions,
          createdAt: new Date(),
          likes: 0,
          saves: 0,
          likedBy: [],
          savedBy: []
        };
        const recipesRef = collection(this.firestore, 'recipes');
        await addDoc(recipesRef, recipe);
        alert('Recipe created successfully!');
        this.router.navigate(['/home']);
      }
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Failed to save recipe. Please try again.');
    } finally {
      this.loading = false;
    }
  }
}
