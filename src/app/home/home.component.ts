import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

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
  recipes$: Observable<Recipe[]>;

  constructor(private firestore: Firestore) {
    const recipesCollection = collection(this.firestore, 'recipes');
    this.recipes$ = collectionData(recipesCollection, { idField: 'id' }).pipe(
      map(recipes => recipes.map(recipe => ({
        ...recipe,
        likes: 10,
        saves: 20,
        imageUrl: recipe['imageUrl'] || 'https://placehold.co/600x400/png?text=Recipe'
      })) as Recipe[]),
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

  ngOnInit() {}
}
