import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Firestore, collection, collectionData, query, orderBy, startAt, endAt, Query, CollectionReference } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FilterService } from '../filter.service';

interface Recipe {
  id?: string;
  name: string;
  imageUrl?: string;
  likes?: number;
  saves?: number;
  [key: string]: any; 
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  recipes$!: Observable<any[]>;

  constructor(
    private firestore: Firestore,
    private filterService: FilterService
  ) {

    this.filterService.searchTerm$.subscribe(searchText => {
      this.fetchRecipes(searchText);
    });
    
  

  }
  
  fetchRecipes(searchText: string) {
    console.log(searchText);  // Check what value is being passed to the query

    const recipesCollection = collection(this.firestore, 'recipes');
     let q = query(recipesCollection, orderBy('name'), startAt(searchText), endAt(searchText + "\uf8ff"));

 
  
    this.recipes$ = collectionData(q, { idField: 'id' }).pipe(
      map(recipes =>
        recipes.map(recipe => ({
          ...recipe,
          likes: 10,
          saves: 20,
          imageUrl: recipe['imageUrl'] || 'https://placehold.co/600x400/png?text=Recipe'
        })) as Recipe[]
      ),
      catchError(error => {
        console.error('Error fetching recipes:', error);
        return of([]);
      })
    );
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'https://placehold.co/600x400/png?text=Recipe';
    }
  }

  ngOnInit() {

  
  }
}
