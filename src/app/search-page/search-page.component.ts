import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AlgoliaService } from '../services/algolia.service';
import { Recipe } from '../models/recipe';
import { Observable, map, switchMap } from 'rxjs';
import { AlgoliaSearchResponse, AlgoliaSearchHit } from '../models/algolia-search-response';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="search-results-container">
      <h2>Search Results for "{{ searchQuery }}"</h2>
      
      @if (loading) {
        <div class="loading">Searching...</div>
      }

      <div class="recipe-grid">
        @for (recipe of searchResults$ | async; track recipe.id) {
          <div class="recipe-card" [routerLink]="['/recipe', recipe.id]">
            <img [src]="recipe.imageUrl" [alt]="recipe.name">
            <div class="recipe-info">
              <h3>{{ recipe.name }}</h3>
              <p>{{ recipe.description }}</p>
            </div>
          </div>
        } @empty {
          <div class="no-results">
            No recipes found for "{{ searchQuery }}"
          </div>
        }
      </div>
    </div>
  `,
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {
  searchQuery: string = '';
  searchResults$!: Observable<Recipe[]>;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private algoliaService: AlgoliaService
  ) {}

  ngOnInit() {
    this.searchResults$ = this.route.queryParams.pipe(
      switchMap(params => {
        this.searchQuery = params['q'] || '';
        this.loading = true;
        
        return this.algoliaService.searchRecipes(this.searchQuery).pipe(
          map((response: AlgoliaSearchResponse) => {
            this.loading = false;
            return response.hits.map(hit => ({
              ...hit,
              id: hit.objectID,
              imageUrl: hit.imageUrl || 'https://placehold.co/600x400/png?text=Recipe',
              likes: hit.likes || 0,
              saves: hit.saves || 0,
              likedBy: hit.likedBy || [],
              savedBy: hit.savedBy || []
            }));
          })
        );
      })
    );
  }
}
