import { Injectable } from '@angular/core';
import { Recipe } from '../models/recipe';
import { Observable, from } from 'rxjs';
import algoliasearch, { SearchClient, SearchIndex } from 'algoliasearch/lite';
import { AlgoliaSearchResponse } from '../models/algolia-search-response';

@Injectable({
  providedIn: 'root'
})
export class AlgoliaService {
  private client: SearchClient;
  private index: SearchIndex;

  constructor() {
    this.client = algoliasearch(
      '3TFVZLTO8Q',
      '2a8f2082c1563ba46cfb61fc1d87f3f6'
    );
    this.index = this.client.initIndex('recipes');
  }

  searchRecipes(query: string): Observable<AlgoliaSearchResponse> {
    return from(this.index.search(query));
  }

  async indexRecipe(recipe: Recipe): Promise<void> {
    await this.index.saveObject({
      ...recipe,
      objectID: recipe.id
    });
  }

  async updateRecipe(id: string, updates: Partial<Recipe>): Promise<void> {
    await this.index.partialUpdateObject({
      ...updates,
      objectID: id
    });
  }

  async deleteRecipe(id: string): Promise<void> {
    await this.index.deleteObject(id);
  }
}