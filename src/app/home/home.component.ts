import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  Firestore,
  collection,
  collectionData,
  orderBy,
  query,
  startAt,
  endAt,
  Query,
  DocumentData,
  where,
} from '@angular/fire/firestore';
import { Observable, of, combineLatest } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Recipe } from '../models/recipe';
import { RecipeService } from '../services/recipe.service';
import { UserService } from '../services/user.service';
import { FilterService } from '../filter.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  recipes$: Observable<any[]>;

  constructor(
    private firestore: Firestore,
    private recipeService: RecipeService,
    private userService: UserService,
    private filterService: FilterService,
  ) {
    this.recipes$ = of([]); // Initialize with empty array
    combineLatest([
      this.filterService.searchTerm$,
      this.filterService.filterTerm$,
    ]).subscribe(([searchText, filter]) => {
      this.fetchRecipes(searchText, filter);
    });
  }

  ngOnInit(): void {
    const recipesCollection = collection(this.firestore, 'recipes');
    this.recipes$ = collectionData(recipesCollection, { idField: 'id' }).pipe(
      map(
        (recipes) =>
          recipes.map((recipe) => ({
            ...recipe,
            likes: recipe['likes'] || 0,
            saves: recipe['saves'] || 0,
            likedBy: recipe['likedBy'] || [],
            savedBy: recipe['savedBy'] || [],
            imageUrl:
              recipe['imageUrl'] ||
              'https://placehold.co/600x400/png?text=Recipe',
          })) as Recipe[],
      ),
      catchError((error) => {
        console.error('Error fetching recipes:', error);
        return of([]);
      }),
    );
  }

  fetchRecipes(searchText: string, filter?: string) {
    console.log(searchText); // Check what value is being passed to the query

    const recipesCollection = collection(this.firestore, 'recipes');

    let q: Query<DocumentData> = query(recipesCollection);

    if (filter === 'date') {
      console.log('Applying date filter');
      q = query(q, orderBy('createdAt', 'desc'));
    } else if (filter === 'category') {
      console.log('Applying category filter');
      q = query(q, orderBy('tags', 'desc'));
    } else {
      // Default behavior: no filter selected, order by name
      console.log('Applying default filter: order by name');
      q = query(
        q,
        orderBy('name'), // Order by name first when no filters are applied
        startAt(searchText),
        endAt(searchText + '\uf8ff'),
      );
    }

    // if (searchText) {
    //   q = query(
    //     q,
    //     orderBy('name'),
    //     startAt(searchText),
    //     endAt(searchText + '\uf8ff'),
    //   );
    // }

    this.recipes$ = collectionData(q, { idField: 'id' }).pipe(
      map(
        (recipes) =>
          recipes.map((recipe) => ({
            ...recipe,
            likes: recipe['likes'] || 0,
            saves: recipe['saves'] || 0,
            likedBy: recipe['likedBy'] || [],
            savedBy: recipe['savedBy'] || [],
            imageUrl:
              recipe['imageUrl'] ||
              'https://placehold.co/600x400/png?text=Recipe',
          })) as Recipe[],
      ),
      catchError((error) => {
        console.error('Error fetching recipes:', error);
        return of([]);
      }),
    );
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'https://placehold.co/600x400/png?text=Recipe';
    }
  }

  async toggleLike(recipe: Recipe, event: Event): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    if (!this.userService.getCurrentUser()) {
      // Redirect to login if user is not authenticated
      return;
    }
    await this.recipeService.toggleLike(recipe);
  }

  async toggleSave(recipe: Recipe, event: Event): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    if (!this.userService.getCurrentUser()) {
      // Redirect to login if user is not authenticated
      return;
    }
    await this.recipeService.toggleSave(recipe);
  }

  isLiked(recipe: Recipe): boolean {
    return this.recipeService.isLikedByUser(recipe);
  }

  isSaved(recipe: Recipe): boolean {
    return this.recipeService.isSavedByUser(recipe);
  }
}
